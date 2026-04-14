/**
* ! 文件由脚本生成，不要直接修改
*/
import defineAPI from "./defineAPI";

const apiMap = {
  /** 用户勋章 */
  "POST /user-medal/page": defineAPI<APIDao.WebEndpointsUserMedalUserMedalPageReq, APIDao.NetCorePalExtensionsDtoPagedDataOfUserMedalPageVo>("/user-medal/page", "POST"),
  /** 取消节点用户 */
  "POST /admin/user-manage/user/cancel-node-user": defineAPI<APIDao.WebApplicationReqCancelNodeUserReq, boolean>("/admin/user-manage/user/cancel-node-user", "POST"),
  /** 禁用用户 */
  "POST /admin/user-manage/user/disable": defineAPI<APIDao.WebApplicationReqDisableUserReq, boolean>("/admin/user-manage/user/disable", "POST"),
  /** 禁用用户 */
  "POST /admin/user-manage/user/enable": defineAPI<APIDao.WebApplicationReqEnableUserReq, boolean>("/admin/user-manage/user/enable", "POST"),
  /** 节点用户翻页查询 */
  "POST /admin/user-manage/node-user/page": defineAPI<APIDao.WebApplicationReqNodeUserPageReq, APIDao.NetCorePalExtensionsDtoPagedDataOfNodeUserPageVo>("/admin/user-manage/node-user/page", "POST"),
  /** 设置节点用户 */
  "POST /admin/user-manage/user/set-node-user": defineAPI<APIDao.WebApplicationReqSetNodeUserReq, boolean>("/admin/user-manage/user/set-node-user", "POST"),
  /** 模糊查找未绑定的节点用户 */
  "POST /admin/user-manage/user/unbound-node-user-search": defineAPI<APIDao.WebEndpointsUserManageUnboundNodeUserSearchReq, Array<APIDao.WebEndpointsUserManageUnboundNodeUserSearchVo>>("/admin/user-manage/user/unbound-node-user-search", "POST"),
  /** 普通用户翻页查询 */
  "POST /admin/user-manage/user/page": defineAPI<APIDao.WebApplicationReqUserPageReq, APIDao.NetCorePalExtensionsDtoPagedDataOfUserPageVo>("/admin/user-manage/user/page", "POST"),
  /** 根据昵称模糊查找普通用户 */
  "POST /admin/user-manage/user/search-by-name": defineAPI<APIDao.WebEndpointsUserManageUserSearchByNameReq, Array<APIDao.WebEndpointsUserManageUserSearchByNameVo>>("/admin/user-manage/user/search-by-name", "POST"),
  /** 模糊查找普通用户 */
  "POST /admin/user-manage/user/search": defineAPI<APIDao.WebEndpointsUserManageUserSearchReq, Array<APIDao.WebEndpointsUserManageUserSearchVo>>("/admin/user-manage/user/search", "POST"),
  /** 节点用户列表 */
  "POST /user/node-user-list": defineAPI<null, Array<APIDao.WebEndpointsUserNodeUserVo>>("/user/node-user-list", "POST"),
  /** 重置用户密码 */
  "POST /user/reset-password": defineAPI<APIDao.WebEndpointsUserResetPasswordReq, boolean>("/user/reset-password", "POST"),
  /** 删除用户 */
  "POST /user/delete": defineAPI<APIDao.WebEndpointsUserUserDeleteReq, boolean>("/user/delete", "POST"),
  /** C端-获取当前登录用户的详细信息 */
  "POST /user/login-user-detail": defineAPI<null, APIDao.WebEndpointsUserUserDetailVo>("/user/login-user-detail", "POST"),
  /** 编辑个人资料 */
  "POST /user/edit-profile": defineAPI<APIDao.WebEndpointsUserUserEditProfileReq, boolean>("/user/edit-profile", "POST"),
  /** 用户登录 */
  "POST /user/login": defineAPI<APIDao.WebEndpointsUserUserLoginReq, APIDao.WebEndpointsUserLoginTokenVo>("/user/login", "POST"),
  /** 修改邮箱地址 */
  "POST /user/modify-email-address": defineAPI<APIDao.WebEndpointsUserUserModifyEmailAddressReq, boolean>("/user/modify-email-address", "POST"),
  /** 修改手机号 */
  "POST /user/modify-phone": defineAPI<APIDao.WebEndpointsUserUserModifyPhoneReq, boolean>("/user/modify-phone", "POST"),
  /** 用户预注册, 返回一个 Guid, 使用该 Guid 完成后续注册流程 */
  "POST /user/pre-register": defineAPI<APIDao.WebEndpointsUserPreRegisterReq, string>("/user/pre-register", "POST"),
  /** 用户注册 */
  "POST /user/register": defineAPI<APIDao.WebEndpointsUserRegisterReq, APIDao.WebEndpointsUserRegisterTokenVo>("/user/register", "POST"),
  /** 发送短信 */
  "POST /sms/send": defineAPI<APIDao.WebEndpointsSmsSendSmsRequest, boolean>("/sms/send", "POST"),
  /** 校验短信验证码 */
  "POST /sms/verify": defineAPI<APIDao.WebEndpointsSmsVerifySmsRequest, boolean>("/sms/verify", "POST"),
  /** 打赏稻米 */
  "POST /score/reward": defineAPI<APIDao.WebEndpointsScoreRewardScoreReq, boolean>("/score/reward", "POST"),
  /** 发送稻米 */
  "POST /score/send": defineAPI<APIDao.WebEndpointsScoreSendScoreReq, boolean>("/score/send", "POST"),
  /** 用户稻米明细 */
  "POST /score/user-sore-record-page": defineAPI<APIDao.WebEndpointsScoreUserScoreRecordPageReq, APIDao.NetCorePalExtensionsDtoPagedDataOfUserScoreRecordPageVo>("/score/user-sore-record-page", "POST"),
  /** 创建提案 */
  "POST /proposal/create": defineAPI<APIDao.WebEndpointsProposalCreateProposalReq, string>("/proposal/create", "POST"),
  /** 删除我的提案 */
  "POST /proposal/delete-my-proposal": defineAPI<APIDao.WebEndpointsProposalDeleteMyProposalReq, boolean>("/proposal/delete-my-proposal", "POST"),
  /** 我的投票选择 */
  "POST /proposal/my-proposal-choice": defineAPI<APIDao.WebEndpointsProposalMyProposalChoiceReq, APIDao.WebEndpointsProposalMyProposalChoiceVo>("/proposal/my-proposal-choice", "POST"),
  /** 我的提案列表 */
  "POST /proposal/my-proposal-list": defineAPI<APIDao.WebEndpointsProposalMyProposalReq, Array<APIDao.WebEndpointsProposalMyProposalVo>>("/proposal/my-proposal-list", "POST"),
  /** 提案详情 */
  "POST /proposal/detail": defineAPI<APIDao.WebEndpointsProposalProposalDetailReq, APIDao.WebEndpointsProposalProposalDetailVo>("/proposal/detail", "POST"),
  /** 提案列表 */
  "POST /proposal/page": defineAPI<APIDao.WebEndpointsProposalProposalPageReq, APIDao.NetCorePalExtensionsDtoPagedDataOfProposalPageVo>("/proposal/page", "POST"),
  /** 投票提案 */
  "POST /proposal/vote": defineAPI<APIDao.WebEndpointsProposalVoteProposalReq, boolean>("/proposal/vote", "POST"),
  /** 节点列表 */
  "POST /node/list": defineAPI<null, Array<APIDao.WebEndpointsNodeNodeListVo>>("/node/list", "POST"),
  /** 公告详情 */
  "POST /information/detail": defineAPI<APIDao.WebEndpointsInformationInformationDetailReq, APIDao.WebEndpointsInformationInformationDetailVo>("/information/detail", "POST"),
  /** 公告分页查询 */
  "POST /information/page": defineAPI<APIDao.WebEndpointsInformationInformationPageReq, APIDao.NetCorePalExtensionsDtoPagedDataOfInformationPageVo>("/information/page", "POST"),
  /** 基金会信息查询 */
  "POST /global-config/foundation-info": defineAPI<null, APIDao.WebEndpointsGlobalConfigFoundationInfoVo>("/global-config/foundation-info", "POST"),
  /** 下载文件 */
  "GET /file/download": defineAPI<{ fileId: string,fileType: APIDao.DomainEnumsFileType,autoDownload: boolean }, Blob>("/file/download", "GET"),
  /** 上传文件 */
  "POST /file/upload": defineAPI<APIDao.WebEndpointsFileFileUploadForm, APIDao.WebApplicationVoFileUploadSuccessVo>("/file/upload", "POST", {divider: {"formData":["file","fileType"]}}),
  /** 拉取图片接口 */
  "GET /external/image/{imageId}": defineAPI<{ imageId: string }, null>("/external/image/{imageId}", "GET", {divider: {"path":["imageId"]}}),
  /** 发送邮件 */
  "POST /email/send": defineAPI<APIDao.WebEndpointsEmailSendEmailRequest, boolean>("/email/send", "POST"),
  /** 查询banner列表 */
  "POST /banner/list": defineAPI<null, Array<APIDao.WebApplicationVoBannerVo>>("/banner/list", "POST"),
  /** 节点列表 */
  "POST /app/list": defineAPI<null, Array<APIDao.WebEndpointsAppAppListVo>>("/app/list", "POST"),
  /** 后台-获取当前登录用户的详细信息 */
  "POST /admin/admin-user/login-user-detail": defineAPI<null, APIDao.WebApplicationVoAdminUserDataVo>("/admin/admin-user/login-user-detail", "POST"),
  /** 后台-密码登录-不直接登录 */
  "POST /admin/admin-user/login-with-password": defineAPI<APIDao.WebEndpointsAdminUserLoginWithPasswordRequest, boolean>("/admin/admin-user/login-with-password", "POST"),
  /** 后台-邮箱验证码登录 */
  "POST /admin/admin-user/login-with-verification-code": defineAPI<APIDao.WebEndpointsAdminUserLoginWithVerificationCodeRequest, APIDao.WebUtilsTokenVo>("/admin/admin-user/login-with-verification-code", "POST"),
  /** 后台-修改后台用户头像 */
  "POST /admin/admin-user/modify-avatar": defineAPI<APIDao.WebEndpointsAdminUserModifyAdminUserAvatarRequest, boolean>("/admin/admin-user/modify-avatar", "POST"),
  /**  */
  "POST /admin/admin-user/page": defineAPI<APIDao.WebEndpointsAdminUserAdminUserPageRequest, APIDao.NetCorePalExtensionsDtoPagedDataOfAdminUserDataVo>("/admin/admin-user/page", "POST"),
  /** 后台-用户重置密码  */
  "POST /admin/admin-user/reset-password": defineAPI<APIDao.WebEndpointsAdminUserResetAdminUserPasswordRequest, boolean>("/admin/admin-user/reset-password", "POST"),
  /** 创建新的管理员用户  */
  "POST /admin/admin-user/create": defineAPI<APIDao.WebEndpointsAdminUserCreateAdminUserRequest, APIDao.WebApplicationVoAdminUserCreateVo>("/admin/admin-user/create", "POST"),
  /** 删除新的后台管理员账号 */
  "POST /admin/admin-user/delete": defineAPI<APIDao.WebEndpointsAdminUserAdminUserIdRequest, boolean>("/admin/admin-user/delete", "POST"),
  /** 模板Id配置查询 */
  "POST /admin/template/get": defineAPI<null, APIDao.WebEndpointsAdminTemplateAdminTemplateIdVo>("/admin/template/get", "POST"),
  /** 批量发放稻米 */
  "POST /admin/score-distribution/batch": defineAPI<APIDao.WebApplicationReqBatchScoreDistributionReq, boolean>("/admin/score-distribution/batch", "POST"),
  /** 稻米发放翻页查询 */
  "POST /admin/score-distribute-record/page": defineAPI<APIDao.WebApplicationReqAdminScoreDistributeRecordPageReq, APIDao.NetCorePalExtensionsDtoPagedDataOfAdminScoreDistributeRecordPageVo>("/admin/score-distribute-record/page", "POST"),
  /** 单个稻米发放 */
  "POST /admin/score-distribution/single": defineAPI<APIDao.WebApplicationReqSingleScoreDistributionReq, string>("/admin/score-distribution/single", "POST"),
  /** 用户稻米明细 */
  "POST /admin/score/user-sore-record-page": defineAPI<APIDao.WebEndpointsAdminScoreAdminUserScoreRecordPageReq, APIDao.NetCorePalExtensionsDtoPagedDataOfAdminUserScoreRecordPageVo>("/admin/score/user-sore-record-page", "POST"),
  /** 后台提案详情 */
  "POST /admin/proposal/detail": defineAPI<APIDao.WebEndpointsAdminProposalAdminProposalDetailReq, APIDao.WebEndpointsAdminProposalAdminProposalDetailVo>("/admin/proposal/detail", "POST"),
  /** 后台提案翻页查询 */
  "POST /admin/proposal/page": defineAPI<APIDao.WebApplicationReqAdminProposalPageReq, APIDao.NetCorePalExtensionsDtoPagedDataOfAdminProposalPageVo>("/admin/proposal/page", "POST"),
  /** 后台下架 */
  "POST /admin/proposal/take-off": defineAPI<APIDao.WebEndpointsAdminProposalAdminTakeOffProposalReq, boolean>("/admin/proposal/take-off", "POST"),
  /** 后台删除提案评论 */
  "POST /admin/proposal/delete-comment": defineAPI<APIDao.WebEndpointsAdminProposalAdminDeleteCommentReq, boolean>("/admin/proposal/delete-comment", "POST"),
  /** 下架贴文 */
  "POST /admin/post/take-off-post": defineAPI<APIDao.WebEndpointsAdminPostTakeOffPostReq, boolean>("/admin/post/take-off-post", "POST"),
  /** 创建节点 */
  "POST /admin/node/create": defineAPI<APIDao.WebEndpointsAdminNodeCreateNodeReq, string>("/admin/node/create", "POST"),
  /** 删除节点 */
  "POST /admin/node/delete": defineAPI<APIDao.WebEndpointsAdminNodeDeleteNodeReq, boolean>("/admin/node/delete", "POST"),
  /** 修改节点 */
  "POST /admin/node/modify": defineAPI<APIDao.WebEndpointsAdminNodeModifyNodeReq, boolean>("/admin/node/modify", "POST"),
  /** 节点详情查询 */
  "POST /admin/node/detail": defineAPI<APIDao.WebEndpointsAdminNodeAdminNodeDetailReq, APIDao.WebEndpointsAdminNodeAdminNodeDetailVo>("/admin/node/detail", "POST"),
  /** 后台节点列表 */
  "POST /admin/node/list": defineAPI<null, Array<APIDao.WebEndpointsAdminNodeAdminNodeListVo>>("/admin/node/list", "POST"),
  /** 排序节点 */
  "POST /admin/node/sort": defineAPI<APIDao.WebEndpointsAdminNodeSortNodeReq, boolean>("/admin/node/sort", "POST"),
  /** 创建banner */
  "POST /admin/medal/create": defineAPI<APIDao.WebApplicationReqCreateMedalReq, string>("/admin/medal/create", "POST"),
  /** 勋章翻页查询 */
  "POST /admin/medal/page": defineAPI<APIDao.WebEndpointsAdminMedalDistributionAdminMedalPageReq, APIDao.NetCorePalExtensionsDtoPagedDataOfAdminMedalPageVo>("/admin/medal/page", "POST"),
  /** 勋章的持有用户翻页查询 */
  "POST /admin/medal/users-holding/page": defineAPI<APIDao.WebApplicationReqAdminUserMedalPageReq, APIDao.NetCorePalExtensionsDtoPagedDataOfAdminUserMedalPageVo>("/admin/medal/users-holding/page", "POST"),
  /** Create 公告 */
  "POST /admin/information/create": defineAPI<APIDao.WebEndpointsAdminInformationCreateInformationReq, string>("/admin/information/create", "POST"),
  /** Delete 公告 */
  "POST /admin/information/delete": defineAPI<APIDao.WebEndpointsAdminInformationDeleteInformationReq, string>("/admin/information/delete", "POST"),
  /** 后台公告详情 */
  "POST /admin/information/detail": defineAPI<APIDao.WebEndpointsAdminInformationAdminInformationDetailReq, APIDao.WebEndpointsAdminInformationAdminInformationDetailVo>("/admin/information/detail", "POST"),
  /** 公告列表查询 */
  "POST /admin/information/list": defineAPI<null, Array<APIDao.WebEndpointsAdminInformationAdminInformationListVo>>("/admin/information/list", "POST"),
  /** 公告排序 */
  "POST /admin/information/sort": defineAPI<APIDao.WebEndpointsAdminInformationSortInformationReq, boolean>("/admin/information/sort", "POST"),
  /** Modify 公告 */
  "POST /admin/information/modify": defineAPI<APIDao.WebEndpointsAdminInformationModifyInformationReq, string>("/admin/information/modify", "POST"),
  /** 获取全局配置 */
  "POST /admin/global-config/detail": defineAPI<null, APIDao.WebEndpointsAdminGlobalConfigAdminGlobalConfigDetailVo>("/admin/global-config/detail", "POST"),
  /** 修改基金会配置 */
  "POST /admin/global-config/modify-foundation-info": defineAPI<APIDao.WebEndpointsAdminGlobalConfigModifyFoundationInfoReq, boolean>("/admin/global-config/modify-foundation-info", "POST"),
  /** 修改提案配置 */
  "POST /admin/global-config/modify-proposal-config": defineAPI<APIDao.WebEndpointsAdminGlobalConfigModifyProposalConfigReq, boolean>("/admin/global-config/modify-proposal-config", "POST"),
  /** 创建banner */
  "POST /admin/banner/list": defineAPI<null, Array<APIDao.WebApplicationVoAdminBannerVo>>("/admin/banner/list", "POST"),
  /** 创建banner */
  "POST /admin/banner/create": defineAPI<APIDao.WebApplicationReqBannerCreateReq, string>("/admin/banner/create", "POST"),
  /** 删除banner */
  "POST /admin/banner/delete": defineAPI<APIDao.WebApplicationReqBannerDeleteReq, boolean>("/admin/banner/delete", "POST"),
  /** 编辑banner */
  "POST /admin/banner/modify": defineAPI<APIDao.WebApplicationReqBannerModifyReq, boolean>("/admin/banner/modify", "POST"),
  /** 排序banner */
  "POST /admin/banner/sort": defineAPI<APIDao.WebApplicationReqBannerSortReq, boolean>("/admin/banner/sort", "POST"),
  /** 节点列表 */
  "POST /admin/app/list": defineAPI<null, Array<APIDao.WebEndpointsAdminAppAdminAppListVo>>("/admin/app/list", "POST"),
  /** 创建应用 Endpoint */
  "POST /admin/app/create": defineAPI<APIDao.WebEndpointsAdminAppCreateAppReq, string>("/admin/app/create", "POST"),
  /** 删除应用 Endpoint */
  "POST /admin/app/delete": defineAPI<APIDao.WebEndpointsAdminAppDeleteAppReq, boolean>("/admin/app/delete", "POST"),
  /** 编辑应用 Endpoint */
  "POST /admin/app/modify": defineAPI<APIDao.WebEndpointsAdminAppModifyAppReq, boolean>("/admin/app/modify", "POST"),
  /** 排序应用 Endpoint */
  "POST /admin/app/sort": defineAPI<APIDao.WebEndpointsAdminAppSortAppReq, boolean>("/admin/app/sort", "POST")
}
export default apiMap;
export type APIMap = typeof apiMap;
export type APIPaths = keyof APIMap;
