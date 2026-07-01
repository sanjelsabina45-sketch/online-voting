import NavBar from "../NewDesign/components/NavBar";
import { Outlet } from "react-router-dom";


function PublicLayout()
{
return(
    <div>
<NavBar/>
 
<main>
<Outlet/>
 </main>
 
 </div>
)
}