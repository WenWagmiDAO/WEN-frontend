import { Drawer } from "@material-ui/core";
import NavContent from "./NavContent.jsx";
import "./sidebar.scss";
import navBg from "../../assets/images/exod-sidebar.jpg";

function Sidebar() {
  return (
    <div className={`sidebar`} id="sidebarContent">
      <Drawer variant="permanent" anchor="left">
        <NavContent />
      </Drawer>
    </div>
  );
}

export default Sidebar;
