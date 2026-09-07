import styles from './index.module.less';
import { Popover } from 'antd';
import Icon_Logout from './assets/logout.svg?react';
import Icon_ChangePass from './assets/change-password.svg?react';
import NavIcon_Arrow from '@/assets/nav.arrow.svg?react';
import { useState } from 'react';
import classNames from 'classnames';
import useCurrentUserInfo from '@/hooks/useCurrentUserInfo';
import { useNavigate } from '@/router';

const UserAccount = () => {
  const [isOpened, setIsOpened] = useState(false);
  const navigate = useNavigate();
  const { userInfo, logout } = useCurrentUserInfo();

  const content = (<div>
    <div className={styles.item} onClick={() => navigate("/change-password")}>
      <Icon_ChangePass className={styles.icon} />
      修改密码
    </div>
    <div className={styles.item} onClick={logout}>
      <Icon_Logout className={styles.icon} />
      退出登录
    </div>
  </div>);

  return (<Popover
    placement="bottomLeft"
    arrow={false}
    overlayClassName={styles.overlay}
    content={content}
    onOpenChange={setIsOpened}
  >
    <div className={styles.wrap}>
      <p className={styles.email}>{userInfo?.phone}</p>
      <NavIcon_Arrow className={classNames(styles.arrow, isOpened ? styles.opened : '')} />
    </div>
  </Popover>);
};

export default UserAccount;

