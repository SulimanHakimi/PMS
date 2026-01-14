import Link from "next/link";
import {
  ShieldCheck,
  Banknote,
  BriefcaseMedical,
  AlertOctagon,
  ChevronsRight,
  ChevronDown
} from "lucide-react";

export default function Home() {
  return (
    <div className="p-8">
      {/* Page Title Section */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">A quick data overview of the inventory.</p>
        </div>
        <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-md text-gray-600 font-medium text-sm flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-colors">
          Download Report
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatusCard
          icon={ShieldCheck}
          iconColor="text-[#4caf50]"
          borderColor="border-[#4caf50]"
          bgButton="bg-[#4caf50]/10"
          textButton="text-[#4caf50]"
          title="Good"
          subtitle="Inventory Status"
          buttonText="View Detailed Report"
          variant="green"
          href="/inventory/medicines"
        />
        <StatusCard
          icon={Banknote}
          iconColor="text-[#ffc107]"
          borderColor="border-[#ffc107]"
          bgButton="bg-[#ffc107]/10"
          textButton="text-[#ffc107]"
          value="Rs. 8,55,875"
          subtitle="Revenue : Jan 2022"
          secondarySubtitle=""
          buttonText="View Detailed Report"
          variant="yellow"
          href="/reports/sales"
        />
        <StatusCard
          icon={BriefcaseMedical}
          iconColor="text-[#2196f3]"
          borderColor="border-[#2196f3]"
          bgButton="bg-[#2196f3]/10"
          textButton="text-[#2196f3]"
          value="298"
          subtitle="Medicines Available"
          buttonText="Visit Inventory"
          variant="blue"
          href="/inventory/medicines"
        />
        <StatusCard
          icon={AlertOctagon}
          iconColor="text-[#f44336]"
          borderColor="border-[#f44336]"
          bgButton="bg-[#f44336]/10"
          textButton="text-[#f44336]"
          value="01"
          subtitle="Medicine Shortage"
          buttonText="Resolve Now"
          variant="red"
          href="/inventory/medicines"
        />
      </div>

      {/* Detailed Sections Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Inventory Box */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Inventory</h3>
            <div className="flex items-center text-xs font-semibold text-gray-500 cursor-pointer hover:text-[#009688]">
              Go to Configuration <ChevronsRight className="w-4 h-4 ml-1" />
            </div>
          </div>
          <div className="flex p-6">
            <div className="flex-1 pr-4 border-r border-gray-100">
              <div className="text-2xl font-bold text-gray-800 mb-1">298</div>
              <div className="text-sm text-gray-500">Total no of Medicines</div>
            </div>
            <div className="flex-1 pl-6">
              <div className="text-2xl font-bold text-gray-800 mb-1">24</div>
              <div className="text-sm text-gray-500">Medicine Groups</div>
            </div>
          </div>
        </div>

        {/* Quick Report Box */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Quick Report</h3>
            <div className="flex items-center text-xs font-medium text-gray-500 cursor-pointer">
              January 2022 <ChevronDown className="w-4 h-4 ml-1" />
            </div>
          </div>
          <div className="flex p-6">
            <div className="flex-1 pr-4 border-r border-gray-100">
              <div className="text-2xl font-bold text-gray-800 mb-1">70,856</div>
              <div className="text-sm text-gray-500">Qty of Medicines Sold</div>
            </div>
            <div className="flex-1 pl-6">
              <div className="text-2xl font-bold text-gray-800 mb-1">5,288</div>
              <div className="text-sm text-gray-500">Invoices Generated</div>
            </div>
          </div>
        </div>

        {/* My Pharmacy Box */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">My Pharmacy</h3>
            <div className="flex items-center text-xs font-semibold text-gray-500 cursor-pointer hover:text-[#009688]">
              Go to User Management <ChevronsRight className="w-4 h-4 ml-1" />
            </div>
          </div>
          <div className="flex p-6">
            <div className="flex-1 pr-4 border-r border-gray-100">
              <div className="text-2xl font-bold text-gray-800 mb-1">04</div>
              <div className="text-sm text-gray-500">Total no of Suppliers</div>
            </div>
            <div className="flex-1 pl-6">
              <div className="text-2xl font-bold text-gray-800 mb-1">05</div>
              <div className="text-sm text-gray-500">Total no of Users</div>
            </div>
          </div>
        </div>

        {/* Customers Box */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Customers</h3>
            <div className="flex items-center text-xs font-semibold text-gray-500 cursor-pointer hover:text-[#009688]">
              Go to Customers Page <ChevronsRight className="w-4 h-4 ml-1" />
            </div>
          </div>
          <div className="flex p-6">
            <div className="flex-1 pr-4 border-r border-gray-100">
              <div className="text-2xl font-bold text-gray-800 mb-1">845</div>
              <div className="text-sm text-gray-500">Total no of Customers</div>
            </div>
            <div className="flex-1 pl-6">
              <div className="text-2xl font-bold text-gray-800 mb-1">Adalimumab</div>
              <div className="text-sm text-gray-500">Frequently bought item</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  iconColor,
  borderColor,
  bgButton,
  textButton,
  title,
  value,
  subtitle,
  buttonText,
  variant,
  href
}) {
  // Defines border top usage based on variant if needed or simplified 
  // The screen shows a border-top or colored button at bottom.
  // Actually the design is a white card with a colored border at the very bottom?
  // No, it looks like the button at the bottom is colored with bg-opacity.
  // And there is a colored border-top? Let's check screenshot again.
  // Screenshot 1: 
  // Card 1 (Good): Border Top Green (or just button green).
  // The visual hierarchy is: Icon + text centered. Bottom full width button.
  // The card has a colored border top.

  const borderColors = {
    green: 'border-t-[#4caf50]',
    yellow: 'border-t-[#ffc107]',
    blue: 'border-t-[#2196f3]',
    red: 'border-t-[#f44336]'
  };

  const buttonBgs = {
    green: 'bg-[#4caf50]/20 hover:bg-[#4caf50]/30 text-[#4caf50]',
    yellow: 'bg-[#ffc107]/20 hover:bg-[#ffc107]/30 text-[#ff8f00]', // Adjusted text for contrast
    blue: 'bg-[#2196f3]/20 hover:bg-[#2196f3]/30 text-[#2196f3]',
    red: 'bg-[#f44336]/20 hover:bg-[#f44336]/30 text-[#f44336]'
  };

  const iconBgs = {
    green: 'border-2 border-[#4caf50]/20',
    yellow: 'border-2 border-[#ffc107]/20',
    blue: 'border-2 border-[#2196f3]/20',
    red: 'border-2 border-[#f44336]/20',
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm pt-6 flex flex-col items-center border border-gray-100 ${borderColors[variant]} border-t-4`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${variant === 'green' ? 'text-[#4caf50] border-2 border-[#4caf50]' : ''} ${variant === 'yellow' ? 'text-[#ffc107] border-2 border-[#ffc107]' : ''} ${variant === 'blue' ? 'text-[#2196f3] border-2 border-[#2196f3]' : ''} ${variant === 'red' ? 'text-[#f44336] border-2 border-[#f44336]' : ''} bg-white`}>
        <Icon className="w-6 h-6 stroke-2" />
      </div>

      {title && <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>}
      {value && <h3 className="text-xl font-bold text-gray-800 mb-1">{value}</h3>}

      <p className="text-sm font-medium text-gray-600 mb-6">{subtitle}</p>

      {href ? (
        <Link href={href} className={`w-full py-2.5 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${buttonBgs[variant]} rounded-b-lg mt-auto`}>
          {buttonText} <ChevronsRight className="w-4 h-4" />
        </Link>
      ) : (
        <button className={`w-full py-2.5 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${buttonBgs[variant]} rounded-b-lg mt-auto`}>
          {buttonText} <ChevronsRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
