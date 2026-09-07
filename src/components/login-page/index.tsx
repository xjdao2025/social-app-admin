import styles from './index.module.less';
import { ConfigProvider } from 'antd';
import { useState } from 'react';
import LanPicker from '../lan-picker';
import LoginForm from './components/LoginForm';
import ForgetForm from './components/ForgetForm';

export default function LoginView() {

  return (
    <div className={styles.loginPage}>
      <div className={styles.left}>
        <div className={styles.content}>
          <div style={{ flex: '130 130 0%' }}></div>
          <div className={styles.slogan}>
            <div>乡建DAO 管理后台</div>
            <div className={styles.subSlogan}>Xiangjian DAO & Backend Management</div>
          </div>
          <div style={{ flex: '500 500 0%' }}></div>
          {/* <img src={bgImg} alt="" className={styles.bgImg} /> */}
          <div style={{ flex: '110 110 0%' }}></div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.content}>
          <MainForm />
          <LoginFooter />
        </div>
      </div>
    </div>
  )
}


function LoginFooter() {

  return (
    <>
      <div className={styles.footerShadow}></div>
      <div className={styles.footer}>
        <div>ALL RIGHTS RESERVED © 2025</div>
        {/*<Space>*/}
        {/*  <PDFViewerModal*/}
        {/*    file="/assets/term of service.pdf"*/}
        {/*    trigger={<Typography.Link className={styles.link}>{t("footer.user-condition")}</Typography.Link>}*/}
        {/*  />*/}
        {/*  |*/}
        {/*  <PDFViewerModal*/}
        {/*    file="/assets/USDI Exchange Service Agreement.pdf"*/}
        {/*    trigger={<Typography.Link className={styles.link}>{t("footer.privacy")}</Typography.Link>}*/}
        {/*  />*/}
        {/*</Space>*/}
      </div>
    </>
  )
}

function MainForm() {
  const [stage, setStage] = useState<'login' | 'forget'>('login')

  return (
    <div className={styles.mainForm}>
      <div className={styles.topActions}>
        <div />
        <LanPicker />
      </div>
      <ConfigProvider
        theme={{
          token: {
            motion: false,
            borderRadius: 8,
          },
          components: {
            Input: {
              controlHeightLG: 54,
              colorBgContainer: '#FAFAFA',
              hoverBg: '#FAFAFA',
              activeShadow: ''
            },
            Form: {
              labelFontSize: 16,
              labelHeight: '24px',
              verticalLabelPadding: '0 0 15px 0',
              itemMarginBottom: 40,
              // label
            },
            Button: {
              controlHeightLG: 54,

              // sizeLG: 66
            },
            Select: {
              controlHeightLG: 54,
              optionHeight: 40,
              optionLineHeight: '40px',
              paddingXXS: 16
            }
          }
        }}
      >
        {stage === 'login' && <LoginForm toForget={() => setStage("forget")} />}
        {stage === 'forget' && <ForgetForm navBack={() => setStage("login")} />}
      </ConfigProvider>
      {/*ProConfigProvider
      {stage === 'forget' && <ForgetForm />}

      {stage === '2fa' && <TwoFactorForm />} */}
    </div>
  )
}