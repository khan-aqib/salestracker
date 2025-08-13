import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';

const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed"];
const priorityColors = {
  High: "bg-red-500",
  Medium: "bg-yellow-400",
  Low: "bg-green-400"
};

export default function SalesPipelineTracker() {
  const [deals, setDeals] = useState(() => {
    const saved = localStorage.getItem("pipeline_deals");
    return saved ? JSON.parse(saved) : [
      { id: 1, stage: "Lead", name: "Website Redesign", company: "Acme Inc.", contact: "John Doe", value: 12000, closeDate: "2025-09-15", priority: "High" },
      { id: 2, stage: "Qualified", name: "Mobile App Dev", company: "Beta Corp", contact: "Jane Smith", value: 25000, closeDate: "2025-09-30", priority: "Medium" },
      { id: 3, stage: "Proposal", name: "Marketing Campaign", company: "Gamma LLC", contact: "Alice Lee", value: 8000, closeDate: "2025-08-25", priority: "Low" }
    ];
  });

  const [draggedDeal, setDraggedDeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({ name: "", company: "", contact: "", value: "", closeDate: "", priority: "Medium", stage: "Lead" });

  useEffect(() => {
    localStorage.setItem("pipeline_deals", JSON.stringify(deals));
  }, [deals]);

  const onDrop = (stage) => {
    setDeals(deals.map(d => d.id === draggedDeal ? { ...d, stage } : d));
    setDraggedDeal(null);
  };

  const addDeal = () => {
    setDeals([...deals, { id: Date.now(), ...newDeal, value: parseFloat(newDeal.value) }]);
    setNewDeal({ name: "", company: "", contact: "", value: "", closeDate: "", priority: "Medium", stage: "Lead" });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 min-h-screen">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold text-purple-700">Sales Pipeline Tracker</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-purple-500 text-white px-4 py-2 rounded-xl shadow hover:bg-purple-600">
          <Plus className="mr-1" size={18}/> Add Deal
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {stages.map(stage => (
          <div key={stage} onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(stage)}
               className="bg-white rounded-2xl p-3 shadow-md flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700 mb-2 flex justify-between">
              {stage} <span className="text-sm text-gray-400">{deals.filter(d => d.stage === stage).length}</span>
            </h2>
            <div className="space-y-3">
              {deals.filter(d => d.stage === stage).map(deal => (
                <motion.div key={deal.id} draggable onDragStart={() => setDraggedDeal(deal.id)}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="bg-gradient-to-r from-white to-blue-50 p-3 rounded-xl shadow cursor-grab">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800">{deal.name}</p>
                    <span className={`text-xs text-white px-2 py-1 rounded-full ${priorityColors[deal.priority]}`}>{deal.priority}</span>
                  </div>
                  <p className="text-sm text-gray-600">{deal.company} – {deal.contact}</p>
                  <p className="text-sm text-purple-700 font-bold">${deal.value.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Close: {deal.closeDate}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-lg relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
              <X size={20}/>
            </button>
            <h2 className="text-xl font-bold mb-4 text-purple-700">Add New Deal</h2>
            <div className="space-y-3">
              {[
                { name: "name", label: "Deal Name", type: "text" },
                { name: "company", label: "Company Name", type: "text" },
                { name: "contact", label: "Contact Person", type: "text" },
                { name: "value", label: "Deal Value", type: "number" },
                { name: "closeDate", label: "Expected Close Date", type: "date" }
              ].map(f => (
                <input key={f.name} type={f.type} placeholder={f.label} value={newDeal[f.name]} onChange={(e) => setNewDeal({ ...newDeal, [f.name]: e.target.value })} className="w-full border p-2 rounded-lg" />
              ))}
              <select value={newDeal.priority} onChange={(e) => setNewDeal({ ...newDeal, priority: e.target.value })} className="w-full border p-2 rounded-lg">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <select value={newDeal.stage} onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })} className="w-full border p-2 rounded-lg">
                {stages.map(s => <option key={s}>{s}</option>)}
              </select>
              <button onClick={addDeal} className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600">Add Deal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}