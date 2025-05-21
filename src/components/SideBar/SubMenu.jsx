import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarLink = styled(Link)`
  display: flex;
  color: #979797;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 40px;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    background: #d7d7db;
    border-left: 4px solid #d7d7db;
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 12px;
`;

const DropdownLink = styled(Link)`
  background: rgb(230, 227, 227);
  height: 40px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color:#979797;
  font-size: 12px;

  &:hover {
    background: #d7d7db;
    cursor: pointer;
  }
`;

const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <SidebarLink onClick={item.subNav && showSubnav}>
        <div>
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </SidebarLink>
      {subnav &&
        item.subNav.map((item, index) => {
          return (
            <DropdownLink to={item.path} key={index}>
              {item.icon}
              <SidebarLabel>{item.title}</SidebarLabel>
            </DropdownLink>
          );
        })}
    </>
  );
};

export default SubMenu;