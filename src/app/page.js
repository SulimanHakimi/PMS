import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { DollarSign, Package, TrendingUp, AlertTriangle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Revenue"
              value="$45,231.89"
              trend="+20.1% from last month"
              icon={DollarSign}
              color="text-emerald-400"
              bg="bg-emerald-400/10"
            />
            <StatCard
              title="Medicines in Stock"
              value="2,345"
              trend="+180 new items"
              icon={Package}
              color="text-blue-400"
              bg="bg-blue-400/10"
            />
            <StatCard
              title="Sales Today"
              value="$1,234.00"
              trend="+19% from yesterday"
              icon={TrendingUp}
              color="text-purple-400"
              bg="bg-purple-400/10"
            />
            <StatCard
              title="Low Stock Alert"
              value="12"
              trend="Items below threshold"
              icon={AlertTriangle}
              color="text-amber-400"
              bg="bg-amber-400/10"
            />
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-semibold text-white">Recent Sales</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-lg">💊</div>
                      <div>
                        <p className="font-medium text-white">Paracetamol 500mg</p>
                        <p className="text-sm text-slate-400">2 packs</p>
                      </div>
                    </div>
                    <p className="font-medium text-emerald-400">+$12.50</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-semibold text-white">Low Stock Items</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                      <div>
                        <p className="font-medium text-white">Amoxicillin 250mg</p>
                        <p className="text-sm text-slate-400">In Stock: 5</p>
                      </div>
                    </div>
                    <button className="text-xs px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 hover:bg-primary-500/30">Restock</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon: Icon, color, bg }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:bg-white/10 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <div className="mt-2 text-2xl font-bold text-white">{value}</div>
        </div>
        <div className={`rounded-xl ${bg} p-3 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs font-medium text-emerald-400">{trend}</span>
      </div>
    </div>
  );
}
