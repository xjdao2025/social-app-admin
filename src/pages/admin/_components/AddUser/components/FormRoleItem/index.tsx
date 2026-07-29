import S from './index.module.less';
import { Checkbox } from 'antd';
import cx from 'classnames'
import { FC, useEffect, useState } from 'react';

/** rice 的角色是字符串,不是 core 的 1/2 —— 服务端的 check 约束只认这两个值。 */
export type AccountRole = 'admin' | 'operator'

export const ACCOUNT_ROLE_TYPE = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
} as const

type RoleItemType = { value: AccountRole; name: string }

type FormRoleItemProps = {
  value?: AccountRole;
  onChange?: (value: AccountRole) => void
}

const FormRoleItem: FC<FormRoleItemProps> = (props) => {
  const [curRole, setCurRole] = useState<AccountRole | undefined>(ACCOUNT_ROLE_TYPE.ADMIN);

  useEffect(() => {
    if (!curRole) return
    props.onChange?.(curRole)
  }, [curRole])

  const roles: RoleItemType[] = [{
    value: ACCOUNT_ROLE_TYPE.ADMIN,
    name: '管理员',
  },{
    value: ACCOUNT_ROLE_TYPE.OPERATOR,
    name: '运营',
  }]

  return <div className={S.container}>
    {roles.map(role => <RoleItem
      key={role.value}
      role={role}
      checked={role.value === curRole}
      onChange={setCurRole}
    />)}
  </div>
};

export default FormRoleItem;

function RoleItem(props: {
  role: RoleItemType;
  checked?: boolean;
  onChange?: (value: AccountRole) => void
}) {
  const { role, checked } = props;
  return <div
    className={cx(S.roleItem, checked && S.active)}
    onClick={() => props.onChange?.(role.value)}
  >
    <p className={S.roleName}>{role.name}</p>
    <Checkbox checked={checked} />
  </div>
}