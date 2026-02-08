import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import Typography from "@material-ui/core/Typography";

export const BoardSideBarData = [
  { title: <hr style={{ width: "200px" }} /> },

  {
    title: (
      <span style={{ color: "#A6990D" }}>
        <strong>BOARD VIEW</strong>
      </span>
    ),
    path: "",

    icon: <AiIcons.AiFillHome style={{ color: "#A6990D" }} />,
    subNav: [],
  },

  {
    title: "Board Approvals",
    path: "",
    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Workplan Approvals",
        path: "/board-dashboard/workplan-approvals",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "Scorecard Approvals",
        path: "/board-dashboard/scorecard-approvals",
        icon: <FaIcons.FaEnvelopeOpenText />,
        cName: "sub-nav",
      },
    ],
  },

  {
    title: "Commissioner General",
    path: "",
    icon: <IoIcons.IoMdPeople />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "View CG Profile",
        path: "/board-dashboard/cg-profile",
        icon: <IoIcons.IoMdPeople />,
        cName: "sub-nav",
      },
    ],
  },
];
