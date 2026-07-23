import { LocaleSwitcher } from "../../atoms/switch/localeSwitcher";
import { ThemeSwitcher } from "../../atoms/switch/themeSwitcher";

export function GroupSwitcherHeader() {
    return ( 
        <div className="flex gap-2">
            <LocaleSwitcher/>
            <ThemeSwitcher />
        </div>
     );
}
