import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionTable from "../components/transactions/TransactionTable";
import Pagination from "../components/transactions/Pagination";
import SendMoneyForm from "../components/transactions/SendMoneyForm";

const allTransactions = [
  {
    id: "#TX1234",
    user: "Rahul Sharma",
    amount: "₹12,000",
    status: "Success",
    date: "23 May 2026",
  },
  {
    id: "#TX1235",
    user: "Anand",
    amount: "₹48,000",
    status: "Flagged",
    date: "23 May 2026",
  },
  {
    id: "#TX1236",
    user: "Priya Nair",
    amount: "₹7,500",
    status: "Pending",
    date: "22 May 2026",
  },
  {
    id: "#TX1237",
    user: "Durai",
    amount: "₹91,000",
    status: "Flagged",
    date: "21 May 2026",
  },
];

const Transactions = () => {

  const [statusFilter, setStatusFilter] = useState("All Status");

  const filteredTransactions =
    statusFilter === "All Status"
      ? allTransactions
      : allTransactions.filter(
          (tx) => tx.status === statusFilter
        );

  return (

    <DashboardLayout>

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Transactions
        </h1>

        <p className="text-gray-400 mt-2">
          Manage and monitor all platform transactions.
        </p>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2">

          <TransactionFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <TransactionTable
            transactions={filteredTransactions}
          />

          <Pagination />

        </div>

        <div>
          <SendMoneyForm />
        </div>

      </div>

    </DashboardLayout>

  );
};

export default Transactions;