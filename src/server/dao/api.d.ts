/**
* ! 文件由脚本生成，不要直接修改
*/
/** */
declare namespace APIDao {
  interface WebEndpointsUserMedalUserMedalPageReq {

    /** 用户域名 */
    domainName: string;

    /** 页码 */
    pageNum: number;

    /** 分页大小 */
    pageSize: number;

  }


  /** POST /user-medal/page */
  interface NetCorePalExtensionsDtoPagedDataOfUserMedalPageVo {

    items: Array<WebEndpointsUserMedalUserMedalPageVo>;

    total: number;

    pageIndex: number;

    pageSize: number;

  }


  interface WebApplicationReqCancelNodeUserReq {

    /** 用户Id */
    id: string;

  }


  interface WebApplicationReqDisableUserReq {

    /** 用户Id */
    id: string;

  }


  interface WebApplicationReqEnableUserReq {

    /** 用户Id */
    id: string;

  }


  interface WebApplicationReqNodeUserPageReq {

    /** 用户昵称 */
    nickName: string;

    /** DID */
    did: string;

    /** 完整用户名，域名 */
    domainName: string;

    /** 邮箱 */
    email: string;

    /** 手机号 */
    phone: string;

    /** 分页页码
                   */
    pageNum: number;

    /** 分页大小 */
    pageSize: number;

  }


  /** POST /admin/user-manage/node-user/page */
  interface NetCorePalExtensionsDtoPagedDataOfNodeUserPageVo {

    items: Array<WebApplicationVoNodeUserPageVo>;

    total: number;

    pageIndex: number;

    pageSize: number;

  }


  interface WebApplicationReqSetNodeUserReq {

    /** 用户Id */
    id: string;

  }


  interface WebEndpointsUserManageUnboundNodeUserSearchReq {

    /** 手机号或邮箱 */
    phoneOrEmail: string;

  }


  /** POST /admin/user-manage/user/unbound-node-user-search */
  interface WebEndpointsUserManageUnboundNodeUserSearchVo {

    /** 用户Id */
    userId: string;

    /** 用户Id */
    userDid: string;

    /** 手机号 */
    phone: string;

    /** 邮箱 */
    email: string;

  }


  interface WebApplicationReqUserPageReq {

    /** 用户昵称 */
    nickName: string;

    /** DID */
    did: string;

    /** 完整用户名，域名 */
    domainName: string;

    /** 邮箱 */
    email: string;

    /** 手机号 */
    phone: string;

    /** 分页页码
                   */
    pageNum: number;

    /** 分页大小 */
    pageSize: number;

  }


  /** POST /admin/user-manage/user/page */
  interface NetCorePalExtensionsDtoPagedDataOfUserPageVo {

    items: Array<WebApplicationVoUserPageVo>;

    total: number;

    pageIndex: number;

    pageSize: number;

  }


  interface WebEndpointsUserManageUserSearchByNameReq {

    /** 发布方昵称或者域名 */
    nickName: string;

  }


  /** POST /admin/user-manage/user/search-by-name */
  interface WebEndpointsUserManageUserSearchByNameVo {

    /** 用户头像 */
    avatar: string;

    /** 用户昵称 */
    nickName: string;

    /** 完整用户名，域名 */
    domainName: string;

    /** DID */
    did: string;

  }


  interface WebEndpointsUserManageUserSearchReq {

    /** 手机号或邮箱 */
    phoneOrEmail: string;

  }


  /** POST /admin/user-manage/user/search */
  interface WebEndpointsUserManageUserSearchVo {

    /** 用户Id */
    userId: string;

    /** 手机号 */
    phone: string;

    /** 邮箱 */
    email: string;

  }


  /** POST /user/node-user-list */
  interface WebEndpointsUserNodeUserVo {

    /** 用户 Id */
    id: string;

    /** DID */
    did: string;

  }


  interface WebEndpointsUserResetPasswordReq {

    /** 邮箱 */
    email: string;

    /** 手机号 */
    phone: string;

    /** 如果是手机号，需要传区号 */
    phoneRegion: string;

    /** 验证码 */
    verifyCode: string;

    /** 重置的密码 */
    password: string;

    resetPasswordType: WebEndpointsUserResetPasswordType;

  }


  interface WebEndpointsUserUserDeleteReq {

    /** 邮箱 */
    email: string;

    /** 手机号 */
    phone: string;

    /** 如果是手机号，需要传区号 */
    phoneRegion: string;

    /** 验证码 */
    verifyCode: string;

    userDeleteType: WebEndpointsUserUserDeleteType;

  }


  /** POST /user/login-user-detail */
  interface WebEndpointsUserUserDetailVo {

    /** 用户Id */
    id: string;

    /** 邮箱 */
    email: string;

    /** 手机号 */
    phone: string;

    /** 手机区号 */
    phoneRegion: string;

    /** 用户昵称 */
    nickName: string;

    /** 完整用户名，域名 */
    domainName: string;

    /** DID */
    did: string;

    /** 稻米 */
    score: number;

    /** 是否是节点用户 */
    nodeUser: boolean;

    /** 是否禁用 */
    disable: boolean;

  }


  interface WebEndpointsUserUserEditProfileReq {

    /** 用户头像 */
    avatar: string;

    /** 用户昵称 */
    nickName: string;

    /** 简介 */
    introduction: string;

  }


  interface WebEndpointsUserUserLoginReq {

    /** 用户域名 */
    domainName: string;

    /** 邮箱 */
    email: string;

    /** 手机号 */
    phone: string;

    /** 手机区号 */
    phoneRegion: string;

    /** 登录密码 */
    password: string;

    loginType: WebEndpointsUserLoginType;

    /** SceneId */
    sceneId: string;

    /** CaptchaVerifyCode */
    captchaVerifyParam: string;

  }


  /** POST /user/login */
  interface WebEndpointsUserLoginTokenVo {

    /** 访问非 BlueSky 的接口携带该 Token */
    token: string;

    /** 访问 BlueSky 的接口使用该 Token */
    blueSkyToken: string;

    /** BlueSky RefreshToken */
    blueSkyRefreshToken: string;

  }


  interface WebEndpointsUserUserModifyEmailAddressReq {

    /** 邮箱地址 */
    email: string;

    codeType: WebUtilsCodeType;

    /** 验证码 */
    code: string;

  }


  interface WebEndpointsUserUserModifyPhoneReq {

    /** 手机区号, 默认86 */
    phoneRegion: string;

    /** 手机号 */
    phone: string;

    codeType: WebUtilsCodeType;

    /** 验证码 */
    code: string;

  }


  interface WebEndpointsUserPreRegisterReq {

    registerType: WebEndpointsUserRegisterType;

    /** 邮箱 */
    email: string;

    /** 手机号 */
    phone: string;

    /** 如果是手机号，需要传区号 */
    phoneRegion: string;

    /** 验证码 */
    verifyCode: string;

    /** SceneId */
    sceneId: string;

    /** CaptchaVerifyCode */
    captchaVerifyParam: string;

  }


  interface WebEndpointsUserRegisterReq {

    /** 预注册获取 Guid */
    preRegisterGuid: string;

    /** 密码 */
    password: string;

    /** 用户生日 {"format":"date-time"} */
    birthday: string;

    /** 用户域名 */
    domainName: string;

  }


  /** POST /user/register */
  interface WebEndpointsUserRegisterTokenVo {

    /** 访问非 BlueSky 的接口携带该 Token */
    token: string;

    /** 访问 BlueSky 的接口使用该 Token */
    blueSkyToken: string;

  }


  interface WebEndpointsSmsSendSmsRequest {

    /** 手机号区号 */
    phoneRegion: string;

    /** 手机号 */
    phone: string;

    codeType: WebUtilsCodeType;

  }


  interface WebEndpointsSmsVerifySmsRequest {

    /** 手机号区号 */
    phoneRegion: string;

    /** 手机号 */
    phone: string;

    codeType: WebUtilsCodeType;

    /** 验证码 */
    code: string;

  }


  interface WebEndpointsScoreRewardScoreReq {

    /** 接收用户的Did */
    toUserDid: string;

    /** 稻米 */
    score: number;

    /** 扩展信息（帖子的标题等相关信息） */
    extendInfo: string;

  }


  interface WebEndpointsScoreSendScoreReq {

    /** 接收用户的手机号或邮箱 */
    userPhoneOrEmail: string;

    /** 稻米 */
    score: number;

  }


  interface WebEndpointsScoreUserScoreRecordPageReq {

    /** 页码 */
    pageNum: number;

    /** 分页大小 */
    pageSize: number;

  }


  /** POST /score/user-sore-record-page */
  interface NetCorePalExtensionsDtoPagedDataOfUserScoreRecordPageVo {

    items: Array<WebEndpointsScoreUserScoreRecordPageVo>;

    total: number;

    pageIndex: number;

    pageSize: number;

  }


  interface WebEndpointsProposalCreateProposalReq {

    /** 提案名称 */
    name: string;

    /** 投票截至时间 {"format":"date-time"} */
    endAt: string;

    /** 附件 Id */
    attachId: string;

  }


  interface WebEndpointsProposalDeleteMyProposalReq {

    /** 提案 Id */
    proposalId: string;

  }


  interface WebEndpointsProposalMyProposalChoiceReq {

    /** 提案 Id */
    proposalId: string;

  }


  /** POST /proposal/my-proposal-choice */
  interface WebEndpointsProposalMyProposalChoiceVo {

    choice: DomainEnumsVoteType;

  }


  interface WebEndpointsProposalMyProposalReq {

    /** 类型 0-全部，1-我发布的，2-我参与的 */
    type: number;

  }


  /** POST /proposal/my-proposal-list */
  interface WebEndpointsProposalMyProposalVo {

    /** 提案 Id */
    proposalId: string;

    /** 提案名称 */
    name: string;

    /** 发起方名称 */
    initiatorId: string;

    /** 发起方名称 */
    initiatorName: string;

    /** 发起方邮箱 */
    initiatorEmail: string;

    /** 发起方头像 */
    initiatorAvatar: string;

    /** 反对票数 */
    opposeVotes: number;

    /** 同意票数 */
    agreeVotes: number;

    status: DomainEnumsProposalStatus;

    /** 创建时间 {"format":"date-time"} */
    createdAt: string;

    /** 发起方 Did */
    initiatorDid: string;

    /** 发起方域名 */
    initiatorDomainName: string;

    choice: DomainEnumsVoteType;

  }


  interface WebEndpointsProposalProposalDetailReq {

    /** 提案 Id */
    proposalId: string;

  }


  interface ProposalCommentVo {

    /** 评论Id */
    commentId: number;

    /** 评论用户名称 */
    userName: string;

    /** 评论内容 */
    content: string;

    /** 创建时间 {"format":"date-time"} */
    createdAt: string;

  }


  /** POST /proposal/detail */
  interface WebEndpointsProposalProposalDetailVo {

    /** 提案 Id */
    proposalId: string;

    /** 提案名称 */
    name: string;

    /** 发起方名称 */
    initiatorId: string;

    /** 发起方 Did */
    initiatorDid: string;

    /** 发起方域名 */
    initiatorDomainName: string;

    /** 发起方名称 */
    initiatorName: string;

    /** 发起方邮箱 */
    initiatorEmail: string;

    /** 发起方头像 */
    initiatorAvatar: string;

    /** 投票截至时间 {"format":"date-time"} */
    endAt: string;

    /** 附件 Id */
    attachId: string;

    /** 总投票数 */
    totalVotes: number;

    /** 反对票数 */
    opposeVotes: number;

    /** 同意票数 */
    agreeVotes: number;

    status: DomainEnumsProposalStatus;

    /** 创建时间 {"format":"date-time"} */
    createdAt: string;

    /** 评论列表 */
    comments: Array<ProposalCommentVo>;

  }


  interface WebEndpointsProposalProposalPageReq {

    /** 页码 */
    pageNum: number;

    /** 分页大小 */
    pageSize: number;

    status: DomainEnumsProposalStatus;

    /** 查询用户的 Did，当前登陆用户 Did */
    did: string;

  }


  /** POST /proposal/page */
  interface NetCorePalExtensionsDtoPagedDataOfProposalPageVo {

    items: Array<WebEndpointsProposalProposalPageVo>;

    total: number;

    pageIndex: number;

    pageSize: number;

  }


  interface WebEndpointsProposalVoteProposalReq {

    /** 提案 Id */
    proposalId: string;

    choose: DomainEnumsVoteType;

  }


  /** POST /node/list */
  interface WebEndpointsNodeNodeListVo {

    /** 节点 Id */
    nodeId: string;

    /** 节点用户 Id */
    userId: string;

    /** 节点用户 Did */
    userDid: string;

    /** 节点 Logo */
    logo: string;

    /** 节点名称 */
    name: string;

    /** 节点描述 */
    description: string;

    /** 稻米数量 */
    score: number;

  }


  interface WebEndpointsInformationInformationDetailReq {

    /** 公告 Id */
    informationId: string;

  }


  /** POST /information/detail */
  interface WebEndpointsInformationInformationDetailVo {

    /** 公告 Id */
    informationId: string;

    /** 公告标题 */
    name: string;

    /** 公告附件 Id */
    attachId: string;

    /** 创建时间 {"format":"date-time"} */
    createAt: string;

  }


  interface WebEndpointsInformationInformationPageReq {

    /** 页码 */
    pageNum: number;

    /** 页大小 */
    pageSize: number;

  }


  /** POST /information/page */
  interface NetCorePalExtensionsDtoPagedDataOfInformationPageVo {

    items: Array<WebEndpointsInformationInformationPageVo>;

    total: number;

    pageIndex: number;

    pageSize: number;

  }


  /** POST /global-config/foundation-info */
  interface WebEndpointsGlobalConfigFoundationInfoVo {

    /** 基金规模 */
    fundScale: number;

    /** 发行稻米规模 */
    issuePointsScale: number;

    /** 基金会公开信息文件 */
    foundationPublicDocument: Array<string>;

  }


  /** 文件类型枚举 1-图片 2-文件 {"x-enumNames":["Picture","File"]} */
  type DomainEnumsFileType = 1 | 2;

  interface WebEndpointsFileFileUploadForm {

    /** 文件 {"format":"binary"} */
    file: Blob;

    fileType: DomainEnumsFileType;

  }


  /** POST /file/upload */
  interface WebApplicationVoFileUploadSuccessVo {

    /** 文件 Id */
    fileId: string;

  }


  interface WebEndpointsEmailSendEmailRequest {

    /** 名称 */
    name: string;

    /** 邮箱账号 */
    email: string;

    codeType: WebUtilsCodeType;

  }


  /** POST /banner/list */
  interface WebApplicationVoBannerVo {

    /** BannerId */
    id: string;

    /** Banner 文件 Id */
    bannerFileId: string;

    /** 链接地址 */
    linkAddress: string;

  }


  /** POST /app/list */
  interface WebEndpointsAppAppListVo {

    /** 应用名称 */
    appId: string;

    /** 应用名称 */
    name: string;

    /** 应用描述 */
    desc: string;

    /** 应用图标 */
    logo: string;

    /** 应用链接 */
    link: string;

  }


  /** POST /admin/admin-user/login-user-detail */
  interface WebApplicationVoAdminUserDataVo {

    /** 管理员Id */
    id: string;

    /** 邮箱 */
    email: string;

    /** 手机号 */
    phone: string;

    /** 手机区号 */
    phoneRegion: string;

    /** 头像 */
    avatar: string;

    role: DomainEnumsRoleType;

    /** 是否特殊账号超级管理员 */
    special: boolean;

  }


  interface WebEndpointsAdminUserLoginWithPasswordRequest {

    /** 手机号 */
    phone: string;

    /** 手机区号 */
    phoneRegion: string;

    /** 密码 */
    password: string;

  }


  interface WebEndpointsAdminUserLoginWithVerificationCodeRequest {

    /** 手机号 */
    phone: string;

    /** 手机区号 */
    phoneRegion: string;

    /** 密码 */
    password: string;

    /** 手机收到的验证码 */
    code: string;

  }


  /** POST /admin/admin-user/login-with-verification-code */
  interface WebUtilsTokenVo {

    /** Jwt token */
    accessToken: string;

    /** 过期时间 */
    expiresIn: string;

    /** 权限范围 */
    scope: string;

  }


  interface WebEndpointsAdminUserModifyAdminUserAvatarRequest {

    /** 新头像 */
    avatar: string;

  }


  interface WebEndpointsAdminUserAdminUserPageRequest {

    /** 分页页码
                   */
    pageNum: number;

    /** 分页大小 */
    pageSize: number;

  }


  /** POST /admin/admin-user/page */
  interface NetCorePalExtensionsDtoPagedDataOfAdminUserDataVo {

    items: Array<WebApplicationVoAdminUserDataVo>;

    total: number;

    pageIndex: number;

    pageSize: number;

  }


  interface WebEndpointsAdminUserResetAdminUserPasswordRequest {

    /** 手机号 */
    phone: string;

    /** 手机区号 默认86 */
    phoneRegion: string;

    /** 新密码 */
    newPassword: string;

    /** 确认新密码 */
    confirmNewPassword: string;

    /** 邮箱收到的验证码 */
    code: string;

  }


  interface WebEndpointsAdminUserCreateAdminUserRequest {

    /** 手机号 */
    phone: string;

    /** 手机区号 默认86 */
    phoneRegion: string;

    role: DomainEnumsRoleType;

  }


  /** POST /admin/admin-user/create */
  interface WebApplicationVoAdminUserCreateVo {

    /** 用户Id */
    id: string;

    /** 初始密码 */
    password: string;

  }


  interface WebEndpointsAdminUserAdminUserIdRequest {

    /** 后台用户Id */
    id: string;

  }


  /** POST /admin/template/get */
  interface WebEndpointsAdminTemplateAdminTemplateIdVo {

    /** 勋章发放 */
    medalDistributionTemplateId: string;

    /** 稻米发放 */
    scoreDistributionTemplateId: string;

  }


  interface WebApplicationReqBatchScoreDistributionReq {

    /** 获得用户文件 Id */
    fileId: string;

    /** 发放稻米 */
    score: number;

    /** 验证码 */
    code: string;

  }


  interface WebApplicationReqAdminScoreDistributeRecordPageReq {

    /** 用户昵称 */
    nickName: string;

    /** 手机号或邮箱 */
    phoneOrEmail: string;

    /** 发放开始时间 yyyy-MM-dd {"format":"date"} */
    startTime?: string;

    /** 发放结束时间 yyyy-MM-dd {"format":"date"} */
    endTime?: string;

    /** 分页页码
                   */
    pageNum: number;

    /** 分页大小 */
    pageSize: number;

  }


  /** POST /admin/score-distribute-record/page */
  interface NetCorePalExtensionsDtoPagedDataOfAdminScoreDistributeRecordPageVo {

    items: Array<WebApplicationVoAdminScoreDistributeRecordPageVo>;

    total: number;

    pageIndex: number;

    pageSize: number;

  }


  interface WebApplicationReqSingleScoreDistributionReq {

    /** 手机号或邮箱 */
    phoneOrEmail: string;

    /** 发放稻米 */
    score: number;

    /** 验证码 */
    code: string;

  }


  interface WebEndpointsAdminScoreAdminUserScoreRecordPageReq {

    /** 用户 Id */
    userId: string;

    /** 页码 */
    pageNum: number;

    /** 分页大小 */
    pageSize: number;

  }


  /** POST /admin/score/user-sore-record-page */
  interface NetCorePalExtensionsDtoPagedDataOfAdminUserScoreRecordPageVo {

    items: Array<WebEndpointsAdminScoreAdminUserScoreRecordPageVo>;

    total: number;

    pageIndex: number;

    pageSize: number;

  }


  interface WebEndpointsAdminProposalAdminProposalDetailReq {

    /** 提案 Id */
    proposalId: string;

  }


  /** POST /admin/proposal/detail */
  interface WebEndpointsAdminProposalAdminProposalDetailVo {

    /** 提案 Id */
    proposalId: string;

    /** 提案名称 */
    name: string;

    /** 发起方名称 */
    initiatorId: string;

    /** 发起方名称 */
    initiatorName: string;

    /** 发起方邮箱 */
    initiatorEmail: string;

    /** 发起方头像 */
    initiatorAvatar: string;

    /** 投票截至时间 {"format":"date-time"} */
    endAt: string;

    /** 附件 Id */
    attachId: string;

    /** 总投票数 */
    totalVotes: number;

    /** 反对票数 */
    opposeVotes: number;

    /** 同意票数 */
    agreeVotes: number;

    status: DomainEnumsProposalStatus;

    /** 是否上架 */
    onShelf: boolean;

    /** 创建时间 {"format":"date-time"} */
    createdAt: string;

    /** 评论列表 */
    comments: Array<ProposalCommentVo>;

  }


  interface WebApplicationReqAdminProposalPageReq {

    /** 提案名称 */
    name: string;

    /** 发起方名称 */
    initiatorName: string;

    status: DomainEnumsProposalStatus;

    /** 发布开始时间 yyyy-MM-dd {"format":"date"} */
    startTime?: string;

    /** 发布结束时间 yyyy-MM-dd {"format":"date"} */
    endTime?: string;

    /** 分页页码
                   */
    pageNum: number;

    /** 分页大小 */
    pageSize: number;

  }


  /** POST /admin/proposal/page */
  interface NetCorePalExtensionsDtoPagedDataOfAdminProposalPageVo {

    items: Array<WebApplicationVoAdminProposalPageVo>;

    total: number;

    pageIndex: number;

    pageSize: number;

  }


  interface WebEndpointsAdminProposalAdminTakeOffProposalReq {

    /** 提案 Id */
    proposalId: string;

  }


  interface WebEndpointsAdminProposalAdminDeleteCommentReq {

    /** 评论 Id */
    commentId: number;

  }


  interface WebEndpointsAdminPostTakeOffPostReq {

    /** Uri */
    uri: string;

    /** Cid */
    cid: string;

  }


  interface WebEndpointsAdminNodeCreateNodeReq {

    /** 节点用户 Id */
    userId: string;

    /** 节点用户 Did */
    userDid: string;

    /** 节点 Logo */
    logo: string;

    /** 节点名称 */
    name: string;

    /** 节点描述 */
    description: string;

  }


  interface WebEndpointsAdminNodeDeleteNodeReq {

    /** 节点 Id */
    nodeId: string;

  }


  interface WebEndpointsAdminNodeModifyNodeReq {

    /** 节点用户 Id */
    userId: string;

    /** 节点用户 Did */
    userDid: string;

    /** 节点 Id */
    nodeId: string;

    /** 节点 Logo */
    logo: string;

    /** 节点名称 */
    name: string;

    /** 节点描述 */
    description: string;

  }


  interface WebEndpointsAdminNodeAdminNodeDetailReq {

    /** 节点 Id */
    nodeId: string;

  }


  /** POST /admin/node/detail */
  interface WebEndpointsAdminNodeAdminNodeDetailVo {

    /** 节点 Id */
    nodeId: string;

    /** 节点 Logo */
    logo: string;

    /** 节点名称 */
    name: string;

    /** 节点描述 */
    description: string;

  }


  /** POST /admin/node/list */
  interface WebEndpointsAdminNodeAdminNodeListVo {

    /** 节点 Id */
    nodeId: string;

    /** 节点 Logo */
    logo: string;

    /** 节点名称 */
    name: string;

    /** 节点描述 */
    description: string;

    /** 节点用户 Id */
    userId: string;

    /** 节点用户 Did */
    userDid: string;

    /** 用户手机号 */
    phone: string;

    /** 用户邮箱 */
    email: string;

  }


  interface WebEndpointsAdminNodeSortNodeReq {

    /** 节点 Id 列表 */
    nodeIds: Array<string>;

  }


  interface WebApplicationReqCreateMedalReq {

    /** 封面Id */
    attachId: string;

    /** 勋章名称 */
    name: string;

    /** 获得用户文件 Id */
    fileId: string;

  }


  interface WebEndpointsAdminMedalDistributionAdminMedalPageReq {

    /** 分页页码
                   */
    pageNum: number;

    /** 分页大小 */
    pageSize: number;

  }


  /** POST /admin/medal/page */
  interface NetCorePalExtensionsDtoPagedDataOfAdminMedalPageVo {

    items: Array<WebApplicationVoAdminMedalPageVo>;

    total: number;

    pageIndex: number;

    pageSize: number;

  }


  interface WebApplicationReqAdminUserMedalPageReq {

    /** 勋章Id */
    medalId: string;

    /** 手机号或邮箱 */
    phoneOrEmail: string;

    /** 分页页码
                   */
    pageNum: number;

    /** 分页大小 */
    pageSize: number;

  }


  /** POST /admin/medal/users-holding/page */
  interface NetCorePalExtensionsDtoPagedDataOfAdminUserMedalPageVo {

    items: Array<WebApplicationVoAdminUserMedalPageVo>;

    total: number;

    pageIndex: number;

    pageSize: number;

  }


  interface WebEndpointsAdminInformationCreateInformationReq {

    /** 公告名称 */
    name: string;

    /** 附件 Id */
    attachId: string;

  }


  interface WebEndpointsAdminInformationDeleteInformationReq {

    /** 公告 Id */
    informationId: string;

  }


  interface WebEndpointsAdminInformationAdminInformationDetailReq {

    /** 公告 Id */
    informationId: string;

  }


  /** POST /admin/information/detail */
  interface WebEndpointsAdminInformationAdminInformationDetailVo {

    /** 公告 Id */
    informationId: string;

    /** 公告标题 */
    name: string;

    /** 公告附件 Id */
    attachId: string;

    /** 创建时间 {"format":"date-time"} */
    createAt: string;

  }


  /** POST /admin/information/list */
  interface WebEndpointsAdminInformationAdminInformationListVo {

    /** 公告 Id */
    id: string;

    /** 公告名称 */
    name: string;

    /** 附件 Id */
    attachId: string;

    /** 创建时间 {"format":"date-time"} */
    createAt: string;

  }


  interface WebEndpointsAdminInformationSortInformationReq {

    /** 公告 Id 列表 */
    informationIds: Array<string>;

  }


  interface WebEndpointsAdminInformationModifyInformationReq {

    /** 公告 Id */
    informationId: string;

    /** 公告名称 */
    name: string;

    /** 附件 Id */
    attachId: string;

  }


  /** POST /admin/global-config/detail */
  interface WebEndpointsAdminGlobalConfigAdminGlobalConfigDetailVo {

    /** 基金规模 */
    fundScale: number;

    /** 发行稻米规模 */
    issuePointsScale: number;

    /** 基金会公开信息文件 */
    foundationPublicDocument: Array<string>;

    /** 提案通过票数 */
    proposalApprovalVotes: number;

  }


  interface WebEndpointsAdminGlobalConfigModifyFoundationInfoReq {

    /** 基金规模 */
    fundScale: number;

    /** 基金会公开信息文件 */
    foundationPublicDocument: Array<string>;

  }


  interface WebEndpointsAdminGlobalConfigModifyProposalConfigReq {

    /** 基金规模 */
    proposalApprovalVotes: number;

  }


  /** POST /admin/banner/list */
  interface WebApplicationVoAdminBannerVo {

    /** BannerId */
    id: string;

    /** Banner 文件 Id */
    bannerFileId: string;

    /** 链接地址 */
    linkAddress: string;

    /** 排序 */
    sort: number;

  }


  interface WebApplicationReqBannerCreateReq {

    /** Banner 文件 Id */
    bannerFileId: string;

    /** 链接地址 */
    linkAddress: string;

  }


  interface WebApplicationReqBannerDeleteReq {

    /** BannerId */
    id: string;

  }


  interface WebApplicationReqBannerModifyReq {

    /** BannerId */
    id: string;

    /** Banner 文件 Id */
    bannerFileId: string;

    /** 链接地址 */
    linkAddress: string;

  }


  interface WebApplicationReqBannerSortReq {

    /** BannerId集合 */
    bannerIds: Array<string>;

  }


  /** POST /admin/app/list */
  interface WebEndpointsAdminAppAdminAppListVo {

    /** 应用名称 */
    appId: string;

    /** 应用名称 */
    name: string;

    /** 应用描述 */
    desc: string;

    /** 应用图标 */
    logo: string;

    /** 应用链接 */
    link: string;

  }


  interface WebEndpointsAdminAppCreateAppReq {

    /** 应用名称 */
    name: string;

    /** 应用描述 */
    desc: string;

    /** 应用图标 */
    logo: string;

    /** 应用链接 */
    link: string;

  }


  interface WebEndpointsAdminAppDeleteAppReq {

    /** 应用 Id */
    appId: string;

  }


  interface WebEndpointsAdminAppModifyAppReq {

    /** 应用 Id */
    appId: string;

    /** 应用名称 */
    name: string;

    /** 应用描述 */
    desc: string;

    /** 应用图标 */
    logo: string;

    /** 应用链接 */
    link: string;

  }


  interface WebEndpointsAdminAppSortAppReq {

    /** 应用 Id 列表 */
    appIds: Array<string>;

  }


  interface WebEndpointsUserMedalUserMedalPageVo {

    /** 勋章 Id */
    medalId: string;

    /** 封面 Id */
    attachId: string;

    /** 勋章名称 */
    name: string;

    /** 获得时间 {"format":"date-time"} */
    getTime?: string;

  }


  interface WebApplicationVoNodeUserPageVo {

    /** 主键Id */
    id: string;

    /** 用户昵称 */
    nickName: string;

    /** DID */
    did: string;

    /** 完整用户名，域名 */
    domainName: string;

    /** 邮箱 */
    email: string;

    /** 手机号 */
    phone: string;

    /** 稻米 */
    score: number;

    /** 是否禁用 */
    disable: boolean;

    createdAt: string;

  }


  interface WebApplicationVoUserPageVo {

    /** 主键Id */
    id: string;

    /** 用户昵称 */
    nickName: string;

    /** DID */
    did: string;

    /** 完整用户名，域名 */
    domainName: string;

    /** 邮箱 */
    email: string;

    /** 手机号 */
    phone: string;

    /** 稻米 */
    score: number;

    /** 是否禁用 */
    disable: boolean;

    createdAt: string;

  }


  /** 重置密码验证类型类型 {"x-enumNames":["Unknown","Email","Phone"]} */
  type WebEndpointsUserResetPasswordType = 0 | 1 | 2;

  /** 删除账户验证类型 {"x-enumNames":["Unknown","Email","Phone"]} */
  type WebEndpointsUserUserDeleteType = 0 | 1 | 2;

  /** 登录类型 {"x-enumNames":["Unknown","DomainName","Email","Phone"]} */
  type WebEndpointsUserLoginType = 0 | 1 | 2 | 3;

  /** 验证码类型 0-未知 1-登录 2-重置密码 3-注册 4-修改邮箱 5-更换手机号 6-后台用户登录 7-后台用户重置密码 8-后台稻米发放 9-注销账户 {"x-enumNames":["Unknown","Login","ResetPassword","Register","ChangeEmail","ChangePhone","AdminUserLogin","AdminUserResetPassword","AdminUserScoreDistribution","DeleteAccount"]} */
  type WebUtilsCodeType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  /** {"x-enumNames":["Unknown","Email","Phone"]} */
  type WebEndpointsUserRegisterType = 0 | 1 | 2;

  interface WebEndpointsScoreUserScoreRecordPageVo {

    /** 稻米明细主键Id */
    id: string;

    type: DomainEnumsScoreSourceType;

    /** 获得原因 */
    reason: string;

    /** 稻米数量 */
    score: number;

    /** 创建时间 {"format":"date-time"} */
    createdAt: string;

  }


  /** 投票选项 {"x-enumNames":["Unknown","Agree","Oppose"]} */
  type DomainEnumsVoteType = 0 | 1 | 2;

  /** 提案状态 {"x-enumNames":["Unknown","Review","Pass","Oppose"]} */
  type DomainEnumsProposalStatus = 0 | 1 | 2 | 3;

  interface WebEndpointsProposalProposalPageVo {

    /** 提案 Id */
    proposalId: string;

    /** 提案名称 */
    name: string;

    /** 发起方名称 */
    initiatorId: string;

    /** 发起方 Did */
    initiatorDid: string;

    /** 发起方域名 */
    initiatorDomainName: string;

    /** 发起方名称 */
    initiatorName: string;

    /** 发起方邮箱 */
    initiatorEmail: string;

    /** 发起方头像 */
    initiatorAvatar: string;

    /** 反对票数 */
    opposeVotes: number;

    /** 同意票数 */
    agreeVotes: number;

    status: DomainEnumsProposalStatus;

    /** 创建时间 {"format":"date-time"} */
    createdAt: string;

    choice: DomainEnumsVoteType;

  }


  interface WebEndpointsInformationInformationPageVo {

    /** 公告 Id */
    id: string;

    /** 公告名称 */
    name: string;

    /** 附件 Id */
    attachId: string;

    /** 创建时间 {"format":"date-time"} */
    createAt: string;

  }


  /** 角色类型 0-未知；1-管理员；2-运营人员 {"x-enumNames":["Unknown","Admin","Operator"]} */
  type DomainEnumsRoleType = 0 | 1 | 2;

  interface WebApplicationVoAdminScoreDistributeRecordPageVo {

    /** 用户昵称 */
    nickName: string;

    /** 手机号 */
    phone: string;

    /** 用户手机区号 */
    phoneRegion: string;

    /** 用户邮箱 */
    email: string;

    /** 发放时间 {"format":"date-time"} */
    getTime: string;

    /** 发放稻米 */
    score: number;

    /** 创建人 */
    createdBy: string;

  }


  interface WebEndpointsAdminScoreAdminUserScoreRecordPageVo {

    /** 稻米明细主键Id */
    id: string;

    type: DomainEnumsScoreSourceType;

    /** 参与方域名 */
    participatorDomainName: string;

    /** 获得原因 */
    reason: string;

    /** 稻米数量 */
    score: number;

    /** 创建时间 {"format":"date-time"} */
    createdAt: string;

    /** 附言 */
    remark: string;

  }


  interface WebApplicationVoAdminProposalPageVo {

    id: string;

    /** 提案名称 */
    name: string;

    /** 发起方头像 */
    initiatorAvatar: string;

    /** 发起方名称 */
    initiatorName: string;

    status: DomainEnumsProposalStatus;

    /** 创建时间 {"format":"date-time"} */
    createdAt: string;

    /** 投票截至时间 {"format":"date-time"} */
    endAt: string;

    /** 是否上架 */
    onShelf: boolean;

  }


  interface WebApplicationVoAdminMedalPageVo {

    /** 勋章Id */
    id: string;

    /** 封面Id */
    attachId: string;

    /** 勋章名称 */
    name: string;

    /** 获得用户文件 Id */
    fileId: string;

    /** 发放用户数量 */
    quantity: number;

  }


  interface WebApplicationVoAdminUserMedalPageVo {

    /** 用户头像 */
    avatar: string;

    /** 用户昵称 */
    nickName: string;

    /** 用户手机号 */
    phone: string;

    /** 用户手机区号 */
    phoneRegion: string;

    /** 用户邮箱 */
    email: string;

  }


  /** 稻米来源类型 0-未知 1-打赏 2-赠送 3-后台发放 {"x-enumNames":["Unknown","Reward","Send","AdminDistribution"]} */
  type DomainEnumsScoreSourceType = 0 | 1 | 2 | 3;


}