import SummaryCard from '../components/charts/SummaryCard';

export default function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard title="Total Income" value="₹2,500" type="income" />
        <SummaryCard title="Total Expenses" value="₹1,200" type="expense" />
        <SummaryCard title="Balance" value="₹1,300" type="balance" />
      </div>
    </div>
  );
}