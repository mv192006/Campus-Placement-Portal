const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-50/50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 border border-primary-100/50 dark:border-primary-900/20',
    green: 'bg-green-50/50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border border-green-100/50 dark:border-green-900/20',
    purple: 'bg-purple-50/50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border border-purple-100/50 dark:border-purple-900/20',
    orange: 'bg-orange-50/50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border border-orange-100/50 dark:border-orange-900/20',
  };

  return (
    <div className="card-hover flex items-center gap-4.5 p-5 group">
      <div className={`p-3.5 rounded-xl transition-all duration-300 group-hover:scale-110 ${colors[color]}`}>
        {Icon && <Icon className="h-6 w-6 stroke-[2]" />}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
