import { forwardRef } from "react";
import { CalendarDays } from "lucide-react";

const CustomInput = forwardRef(({ value, onClick, onChange, disabled, width}, ref) => (
    <div className={`relative ${width ? width : 'w-full'}`}>
        <input
            disabled={disabled}
            ref={ref}
            onClick={onClick}
            onChange={onChange}
            value={value}
            className="border rounded p-1 pr-8 w-full bg-white h-[34px]"
        />
        <CalendarDays
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
            size={16}
        />
    </div>
));

export default CustomInput;