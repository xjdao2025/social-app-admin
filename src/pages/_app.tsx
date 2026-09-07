import LanPicker from "@/components/lan-picker";
import { ProConfigProvider, ProLayout } from "@ant-design/pro-components";
import { Button, Space, theme } from "antd";
import { Outlet, useLocation } from 'react-router-dom';
import './global.less';
import styles from './app.module.less';
import NavIcon_Post from '@/assets/nav/post.svg?react';
import NavIcon_Post_Active from '@/assets/nav/post.active.svg?react';
import NavIcon_Admin from '@/assets/nav/admin.svg?react';
import NavIcon_Admin_Active from '@/assets/nav/admin.active.svg?react';
import NavIcon_Place_Active from '@/assets/nav/place.active.svg?react';
import NavIcon_Place from '@/assets/nav/place.svg?react';

import NavIcon_Setting_Active from '@/assets/nav/setting.active.svg?react';
import NavIcon_Setting from '@/assets/nav/setting.svg?react';

import NavIcon_User_Active from '@/assets/nav/user.active.svg?react';
import NavIcon_User from '@/assets/nav/user.svg?react';
import classNames from "classnames";
import LoginView from "@/components/login-page";
import UserAccount from "@/components/user-account";
import { ReactNode, useEffect } from "react";
import { Link } from "@/router";
import useUserInfoStore from "@/store/userInfo";


export default function Layout() {

  return (
    <>
      <InjectCssVarFromAntdToken />
      <AuthedLayout><Outlet /></AuthedLayout>
    </>
  )
}


function InjectCssVarFromAntdToken() {
  const { token: antdToken } = theme.useToken();
  useEffect(() => {
    const cssVars = {
      'mint-color-primary': antdToken.colorPrimary,
    }
    const styledId = 'global-css-variable';
    const oldElement = document.getElementById(styledId);
    const style = oldElement ?? document.createElement('style');
    style.id = styledId;
    let cssText = ':root{';
    Object.entries(cssVars).forEach(([key, value]) => {
      cssText += `--${key
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()}:${value};`;
    });
    cssText += '}';
    // clear and set
    style.innerHTML = cssText;
    if (!oldElement) {
      document.head.appendChild(style);
    }

  }, [antdToken.colorPrimary])

  return null;
}

function AuthedLayout({ children }) {
  const { token, userInfo } = useUserInfoStore();

  const currentPath = useLocation().pathname;
  // console.log(i18n.language);
  if (!token) return <LoginView />;
  if (currentPath === '/change-password') return children;
  return (
    <ProLayout
      layout="mix"
      title="Console"
      pageTitleRender={() => 'Console'}
      logo="/logo.png"
      token={{
        header: {
          heightLayoutHeader: 64
        }
      }}
      collapsed={false}
      className={styles.layout}
      siderWidth={224}
      contentStyle={{ padding: 20, paddingBottom: 0, zIndex: 1, minWidth: 1200 }}
      menu={{
        params: { userInfo },
        locale: false,
        async request() {
          // rice 的 role 是字符串 'admin' | 'operator'。老 core 时代这里是数字
          // 枚举 USER_ROLE_TYPE.ADMIN(=1),迁移时漏改,'admin' === 1 恒 false,
          // 于是「投放管理」和「管理员管理」两组菜单对所有人隐藏。
          const adminAuth = userInfo?.role === 'admin'
          return [
            {
              name: '帖子管理',
              path: '/thread',
              icon: <SwitchIcon normal={<NavIcon_Post />} active={<NavIcon_Post_Active />} />,
              children: [
                { name: '帖子', path: '/thread/list' },
                { name: '提案', path: '/thread/proposal' },
              ]
            },
            {
              name: '用户管理',
              path: '/user',
              icon: <SwitchIcon normal={<NavIcon_User />} active={<NavIcon_User_Active />} />,
              children: [
                { name: '普通用户', path: '/user/normal' },
                { name: '节点用户', path: '/user/node' },
              ]
            },
            {
              name: '投放管理',
              path: '/place',
              hideInMenu: !adminAuth,
              icon: <SwitchIcon normal={<NavIcon_Place />} active={<NavIcon_Place_Active />} />,
              children: [
                { name: '发放徽章', path: '/place/badge' },
                { name: '发放稻米', path: '/place/points' },
                { name: '金库财务公示', path: '/place/foundation' },
              ]
            },
            {
              name: '系统配置',
              path: '/setting',
              icon: <SwitchIcon normal={<NavIcon_Setting />} active={<NavIcon_Setting_Active />} />,
              children: [
                { name: 'Banner配置', path: '/setting/banner' },
                { name: '节点信息配置', path: '/setting/node' },
                { name: '提案配置', path: '/setting/proposal' },
                {
                  name: '公告栏配置',
                  path: '/setting/announcements',
                  hideChildrenInMenu: true,
                  children: [
                    { name: '新增公告', path: '/setting/announcements/new' },
                    { name: '编辑公告', path: '/setting/announcements/edit/:id' },
                  ]
                },
                { name: '应用市场配置', path: '/setting/apps' },
              ]
            },
            {
              name: '管理员管理',
              path: '/admin',
              hideInMenu: !adminAuth,
              icon: <SwitchIcon normal={<NavIcon_Admin />} active={<NavIcon_Admin_Active />}
            /> },
          ]
        },
      }}
      menuProps={{
        selectedKeys: [currentPath],
        className: styles.menu,
        inlineIndent: 24,
      }}
      menuItemRender={(item, dom, menuProps) => {
        return (
          <Link to={{ pathname: item.path! }}>
            {dom}
          </Link>
        );
      }}
      fixedHeader
      fixSiderbar
      actionsRender={() => (
        <Space size={32}>
          <LanPicker />
          <UserAccount />
        </Space>
      )}
      collapsedButtonRender={false}
    >
      {children}
    </ProLayout>
  )
}

function SwitchIcon({ normal, active }: { normal: ReactNode, active: ReactNode }) {
  
  return (
    <>
      <span className={classNames(styles.switchIcon, styles.normal)}>{normal}</span>
      <span className={classNames(styles.switchIcon, styles.active)}>{active}</span>
    </>
  )
}