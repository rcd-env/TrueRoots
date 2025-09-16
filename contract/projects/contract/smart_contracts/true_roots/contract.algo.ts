import { Contract, GlobalState, abimethod, assert, Bytes, bytes, Txn, Uint64, uint64 } from "@algorandfoundation/algorand-typescript";

// -------------------------------
// ENUM / CONSTANTS
// -------------------------------
export const STATUS_COLLECTED = Bytes("COLLECTED");
export const STATUS_QC_PENDING = Bytes("QC_PENDING");
export const STATUS_QC_VERIFIED = Bytes("QC_VERIFIED");
export const STATUS_PROCESSED = Bytes("PROCESSED");
export const STATUS_SHIPPED = Bytes("SHIPPED");
export const STATUS_INIT = Bytes("INITIALIZED");

// Error codes (short to save bytes in TEAL logs)
const ERR_NOT_ADMIN = "E_ADMIN";
const ERR_NOT_LAB = "E_LAB";
const ERR_NOT_PROC = "E_PROC";
const ERR_BAD_STATUS = "E_STATUS";
const ERR_EXISTS = "E_EXISTS";
const ERR_SCORE = "E_SCORE";
const ERR_QTY = "E_QTY";
const ERR_REWARD_DONE = "E_REWARD_DONE";

// -------------------------------
// GLOBAL STATE SCHEMA (single active batch design for first iteration)
// NOTE: For multiple concurrent batches we would migrate to BoxMap keyed by batch id.
// -------------------------------
export class TrueRoots extends Contract {
  // Access / roles
  admin = GlobalState<bytes>();
  auth_lab = GlobalState<bytes>();
  auth_proc = GlobalState<bytes>();

  // Reward params
  reward_asa = GlobalState<uint64>();
  base_reward = GlobalState<uint64>();
  reward_done = GlobalState<uint64>(); // 0/1

  // Batch tracking
  batch_id = GlobalState<bytes>();
  collector = GlobalState<bytes>();
  collected_at = GlobalState<uint64>();
  geo = GlobalState<bytes>(); // "lat,lng"
  species = GlobalState<bytes>();
  quantity_kg = GlobalState<uint64>();
  status = GlobalState<bytes>();

  // QC
  lab_cert_cid = GlobalState<bytes>();
  qc_at = GlobalState<uint64>();
  authenticity_score = GlobalState<uint64>();

  // Processing
  processor = GlobalState<bytes>();
  proc_at = GlobalState<uint64>();
  final_img_cid = GlobalState<bytes>();
  consumer_qr = GlobalState<bytes>();

  // -------------------------------
  // LIFECYCLE: Application Creation
  // -------------------------------
  createApplication(admin: bytes, lab: bytes, proc: bytes, rewardAsa: uint64, baseReward: uint64) {
    // Set initial roles and params
    this.admin.value = admin;
    this.auth_lab.value = lab;
    this.auth_proc.value = proc;
    this.reward_asa.value = rewardAsa;
    this.base_reward.value = baseReward;
    this.reward_done.value = Uint64(0);
    // Contract is now initialized and ready to accept batches
    this.status.value = STATUS_INIT;
  }

  // -------------------------------
  // HELPERS (access control & validations)
  // -------------------------------
  private onlyAdmin() {
    assert(Txn.sender.bytes.equals(this.admin.value), ERR_NOT_ADMIN);
  }
  private onlyLab() {
    assert(Txn.sender.bytes.equals(this.auth_lab.value), ERR_NOT_LAB);
  }
  private onlyProcessor() {
    assert(Txn.sender.bytes.equals(this.auth_proc.value), ERR_NOT_PROC);
  }

  // -------------------------------
  // ABI METHODS
  // -------------------------------

  /** Create a new batch (only once in this simplified version). */
  @abimethod()
  create_batch(batch_id: bytes, collector: bytes, collected_at: uint64, geo: bytes, species: bytes, quantity_kg: uint64) {
    assert(!this.batch_id.hasValue, ERR_EXISTS);
    assert(quantity_kg > 0, ERR_QTY);
    this.batch_id.value = batch_id;
    this.collector.value = collector;
    this.collected_at.value = collected_at;
    this.geo.value = geo;
    this.species.value = species;
    this.quantity_kg.value = quantity_kg;
    this.status.value = STATUS_COLLECTED;
  }

  /** Lab verification */
  @abimethod()
  verify_qc(lab_cert_cid: bytes, authenticity_score: uint64, qc_at: uint64) {
    this.onlyLab();
    assert(this.status.value.equals(STATUS_COLLECTED) || this.status.value.equals(STATUS_QC_PENDING), ERR_BAD_STATUS);
    assert(authenticity_score <= Uint64(100), ERR_SCORE);
    this.lab_cert_cid.value = lab_cert_cid;
    this.authenticity_score.value = authenticity_score;
    this.qc_at.value = qc_at;
    this.status.value = STATUS_QC_VERIFIED;
  }

  /** Processing step */
  @abimethod()
  process_batch(final_img_cid: bytes, consumer_qr: bytes, proc_at: uint64) {
    this.onlyProcessor();
    assert(this.status.value.equals(STATUS_QC_VERIFIED), ERR_BAD_STATUS);
    this.final_img_cid.value = final_img_cid;
    this.consumer_qr.value = consumer_qr;
    this.proc_at.value = proc_at;
    this.processor.value = Txn.sender.bytes;
    this.status.value = STATUS_PROCESSED;
  }

  /** Mark shipped */
  @abimethod()
  ship_batch() {
    // admin OR processor
    assert(Txn.sender.bytes.equals(this.admin.value) || Txn.sender.bytes.equals(this.auth_proc.value), ERR_NOT_PROC);
    assert(this.status.value.equals(STATUS_PROCESSED), ERR_BAD_STATUS);
    this.status.value = STATUS_SHIPPED;
  }

  /** Mark rewards distributed (ASA transfer done in grouped txn externally) */
  @abimethod()
  reward_distributed() {
    this.onlyAdmin();
    assert(this.reward_done.value === Uint64(0), ERR_REWARD_DONE);
    assert(
      this.status.value.equals(STATUS_QC_VERIFIED) ||
        this.status.value.equals(STATUS_PROCESSED) ||
        this.status.value.equals(STATUS_SHIPPED),
      ERR_BAD_STATUS
    );
    this.reward_done.value = Uint64(1);
  }

  /** Update roles / base reward */
  @abimethod()
  update_auth(new_lab: bytes, new_proc: bytes, new_base_reward: uint64) {
    this.onlyAdmin();
    this.auth_lab.value = new_lab;
    this.auth_proc.value = new_proc;
    this.base_reward.value = new_base_reward;
  }

  /** Read-only provenance snapshot (concatenate selected fields); frontend decodes */
  @abimethod({ readonly: true })
  provenance(): bytes {
    // Format: batch_id|status|species|geo|lab_cid|final_img|qr
    let sep = Bytes("|");
    let out = this.batch_id.value
      .concat(sep)
      .concat(this.status.value)
      .concat(sep)
      .concat(this.species.value)
      .concat(sep)
      .concat(this.geo.value)
      .concat(sep);
    if (this.lab_cert_cid.hasValue) out = out.concat(this.lab_cert_cid.value);
    out = out.concat(sep);
    if (this.final_img_cid.hasValue) out = out.concat(this.final_img_cid.value);
    out = out.concat(sep);
    if (this.consumer_qr.hasValue) out = out.concat(this.consumer_qr.value);
    return out;
  }

  // Clear state approval (allow clear) - no custom logic
  clearStateProgram(): boolean {
    return true;
  }
}
