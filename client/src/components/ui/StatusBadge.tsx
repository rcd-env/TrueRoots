
import type { BatchStatus } from '../../types';

interface StatusBadgeProps {
  status: BatchStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const statusConfig = {
    collected: {
      label: 'Collected',
      classes: 'bg-blue-100 text-blue-800'
    },
    delivered: {
      label: 'Delivered',
      classes: 'bg-yellow-100 text-yellow-800'
    },
    verified: {
      label: 'Verified',
      classes: 'bg-green-100 text-green-800'
    },
    formulated: {
      label: 'Formulated',
      classes: 'bg-purple-100 text-purple-800'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes} ${className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
