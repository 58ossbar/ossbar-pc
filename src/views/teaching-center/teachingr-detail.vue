<!-- 课堂的主页面 -->
<template>
  <div class="teaching-center-box" >
    <header-nav2 :current-index="hasPermission?4:(isTeacher ? 6 : 8)" :is-hide-nav-on-scroll="true"/>
    <div class="wind-1240 header-box">
      <div class="serachLibrary" >
        <img :src="classroomInfo.pic" class="teaching-packa-img">
        <div class="teaching-packa-info">
          <div class="teaching-packa-info-name">
            <div :title="classroomInfo.name" class="name-info">{{ classroomInfo.name }}</div>
          </div>
          <div>
            <span v-if="refPkgVersion" style="font-size: 14px;">教学包版本：{{ refPkgVersion }}</span>
            <el-tag
              v-if="upgradeList.length > 0 && hasPermission"
              style="cursor: pointer;magrin-left:20px;"
              type="success"
              size="mini"
              effect="plain"
              @click="changeVersion">更换版本</el-tag>
          </div>
          <div class="belong-to-department">
            <span :title="pkgInfo.deployMainType">{{ pkgInfo.deployMainType | ellipsis }}</span>
            <span>发布</span>
            <span v-if="pkgInfo.pkgLevel">|</span>
            <span v-if="pkgInfo.pkgLevel">适用于{{ pkgInfo.pkgLevel }}</span>
            <el-link v-if="classroomInfo.ifLiveLesson === 'Y'" :title="classroomInfo.linkUrl" type="primary" @click="clickLinkUrl(classroomInfo.linkUrl)">进入直播</el-link>
          </div>
        </div>
        <div class="edit-teaching-package-user">
          <div class="title">
            <span style="font-size: 14px;">邀请码：{{ classroomInfo.invitationCode }}</span>
            <div class="class-qrCode-box" @click="previewPicture()">
              <img
                class="class-qrCode"
                src="static/image/qrCode.png"
                alt="二维码">
            </div>
          </div>
        </div>

        <modal-dialog
          id="preview-picture-box"
          ref="codeModal"
          :is-show-footer-btn="false"
          :title="'课堂邀请码：' + classroomInfo.invitationCode"
          @cancel="closeModal">
          <div slot="main" style="text-align: center;">
            <img :src="classroomInfo.qrCode" style="width: 100%;max-height:100%;" alt="课堂二维码">
          </div>
        </modal-dialog>

        <div class="edit-teaching-package-user edit-teaching-package-teaching">
          <div class="user-info-box">
            <div :title="teacherInfo.teacherName" class="user-info">
              <img :src="teacherInfo.teacherPic" class="user-img" width="40" height="40">
              <div class="right-user-detail">
                <div>教师</div>
                <div style="overflow: hidden;">{{ teacherInfo.teacherName }}</div>
              </div>
            </div>
            <div :title="teacherInfo.teachingAssistantName" class="user-info">
              <img :src="teacherInfo.teachingAssistantPic" class="user-img" width="40" height="40">
              <div class="right-user-detail">
                <div>助教</div>
                <div style="overflow: hidden;">{{ teacherInfo.teachingAssistantName }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div style="margin-left: 50px;width: 1px;height: 110px;margin-top: 15px;background: #b2b2b2"></div> -->
        <div class="right-teaching-package-info">
          <div>
            班级信息
          </div>
          <div style="font-size: 13px">{{ classInfo.className }}</div>
          <div style="font-size: 13px">
            <i class="fa fa-user-circle icon-study-num" aria-hidden="true"/>
            <span>{{ classroomInfo.studyNum }}</span>人学习
          </div>
        </div>
        <div class="teaching-package-state">
          <span> {{ pkgInfo.pkgLimit }}</span>
        </div>
      </div>
    </div>
    <!--内容begin-->
    <div
      class="teaching-center wind-1240 serachContent pkg-page-center-min-height"
      style="margin:10px auto;position: relative;">
      <div class="left-teaching-center-con">
        <nav class="resouse-teach-nav">
          <div id="nav-tab" class="nav nav-tabs">
            <span
              id="nav-profile-tab"
              :class="['nav-item nav-link',(currIndex === 0)?'active':'']">活教材(<span>{{ pkgInfo.pkgResCount }}</span>)</span>
            <span
              id="nav-contact-tab"
              :class="['nav-item nav-link',(currIndex === 1)?'active':'']">活动(<span id="activityNum">{{ pkgInfo.pkgActCount }}</span>)</span>
            <span
              id="nav-home-tab"
              :class="['nav-item nav-link',(currIndex === 2)?'active':'']">课堂成员(<span>{{ studentNum }}</span>)</span>
            <span
              id="nav-message-tab"
              :class="['nav-item nav-link',(currIndex === 3)?'active':'']">消息(<span>{{ newMsgCount }}</span>)</span>
            <span
              id="nav-cloud-disk"
              ref="cloudDisk"
              :class="['nav-item nav-link',(currIndex === 4)?'active':'']">云盘</span>
            <span
              v-if="hasPermission && !isClassroomFinished"
              id="nav-teaching-pcks"
              :class="['nav-item nav-link',(currIndex === 5)?'active':'']">发布教学包</span>
          </div>
        </nav>
        <div id="nav-tabContent" class="tab-content">
          <!--活教材begin-->
          <div
            :class="['tab-pane fade',(currIndex === 0)?'show active':'']">
            <teaching-material
              v-if ="subjectId !== '' && hasPermission!=null && tabPanelId !== 'nav-contact-tab'"
              ref="teachingMaterialInterface"
              :has-permission="hasPermission"
              :has-permission-actual="hasPermissionActual"
              :pkg-id="pkgId"
              :subject-id="subjectId"
              :is-classroom-detail="true"
              :is-hide-nav-on-scroll="true"
              :classroom-intro="classroomInfo.intro"/>
          </div>
          <!--活教材end-->
          <!--活动库begin-->
          <div
            :class="['tab-pane fade',(currIndex === 1)?'show active':'']">
            <activity-library
              ref="activityLibraryInterface"
              :is-classroom-detail="isClassroomDetail"
              :has-permission="hasPermission"
              :is-classroom-finished="isClassroomFinished"
              :pkg-id="pkgId"
              :subject-id="subjectId"
              @updateInfo="handleUpdateInfo"/>
              <!--<activity-modules
                      :hasPermission="hasPermission"
                      :pkgId="pkgId"
                      :isClassroomDetail="isClassroomDetail"
                  ></activity-modules>-->
          </div>
          <!--活动库end-->
          <!--成员begin-->
          <div
            :class="['tab-pane fade class-member',(currIndex === 2)?'show active':'']"
            style="width: 100%;">
            <classroom-members
              ref="classroomMembersInterface"
              :class-id="classId"
              :pkg-id="pkgId"
              :is-classroom-finished="isClassroomFinished"
              :has-permission="hasPermission"
              :ct-id="ct_id"/>
          </div>
          <!--成员end-->
          <!-- 消息begin -->
          <div
            :class="['tab-pane fade',(currIndex === 3)?'show active':'']"
            style="width: 100%;">
            <!-- :isShowMes="tabPanelId ==='nav-message-tab'" :classId="classId" :pkgId="pkgId" :ctId="ct_id" -->
            <message ref="messageInterface" :has-permission="hasPermission" :pkg-id="pkgId" :ct-id="ct_id" @unreadNumAdd="unreadNumAdd"/>
          </div>
          <!-- 消息end -->
          <!-- 云盘begin -->
          <div
            :class="['tab-pane fade',(currIndex === 4)?'show active':'']"
            style="width: 100%;">
            <cloud-disk
              ref="cloudDiskPage"
              :has-permission="hasPermission"
              :is-classroom-finished="isClassroomFinished"
              :is-classroom-detail="isClassroomDetail"/>
          </div>
          <!-- 云盘end -->
          <!-- 发布教学包begin -->
          <div
            :class="['tab-pane fade',(currIndex === 5)?'show active':'']"
            style="width: 100%;">
            <publish-teaching-package
              v-if="subjectId!==''"
              ref="publishTeachingPackageInterface"
              :pkg-id="pkgId"
              :pkg-info="pkgInfo"
              :subject-id="subjectId"/>
          </div>
          <!-- 发布教学包end -->
        </div>
      </div>
      <!-- <div class="ringh-teaching-center-menu">
              <div
                  v-if="hasPermission"
                  @click="handleUnfold"
                  class="menu-item-arrow-box"
                  role="button"
                  data-toggle="collapse"
                  href="#collapseExample"
                  aria-expanded="true"
                  aria-controls="collapseExample">
                  <img v-if="!isDownUnfold" src="static/image/teaching_center/arrow_down_1.png" alt="向下展开" title="向下展开">
                  <img v-if="isDownUnfold" src="static/image/teaching_center/arrow_up_1.png" alt="向上折叠" title="向上折叠">
              </div>
              <ul  class="menu-list collapse show" v-if="hasPermission && false" id="collapseExample">
                  ///<li class="menu-item" @click="handleOpenEmpiricallDialog('empirical')" title="设置经验值">
                    ///  <img src="static/image/tool.png" alt="工具软件" title="工具软件">
                    ///  <i class="el-icon-setting" style="font-size:23px;"></i>
                    ///  <p>设置经验值</p>
                ///  </li>
                  <li class="menu-item" @click="handleOpenSettiongsDialog" title="课堂设置">
                    ///<img src="static/image/tool.png" alt="工具软件" title="工具软件">
                      <i class="el-icon-setting" style="font-size:23px;"></i>
                      <p>课堂设置</p>
                  </li>
                  <li class="menu-item" @click="boardDialogVisible = true" title="教学白板">
                    ///<img src="static/image/tool.png" alt="工具软件" title="工具软件">
                      <i class="el-icon-date" style="font-size:23px;"></i>
                      <p>教学白板</p>
                  </li>
                  <li class="menu-item" @click="handleOpenScreenShortDialog" title="截图工具">
                    ///<img src="static/image/tool.png" alt="工具软件" title="工具软件">
                      <i class="el-icon-date" style="font-size:23px;"></i>
                      <p>截图工具</p>
                  </li>
                  <li class="menu-item" v-for="(item, index) in rightShortcutPane" :key="index"  @click="handleOpenSyllabus(item.name)" :title="item.name">
                      /// <img src="static/image/teaching_outline.png" alt="教学大纲" title="教学大纲">
                      <i :class="[item.icon]" style="font-size:23px;"></i>
                      <p class="hiddenText">{{item.name}}</p>
                  </li>
              </ul>
          </div> -->

      <div class="ringh-teaching-center-menu">
        <div
          v-if="hasPermission"
          class="menu-item-arrow-box"
          role="button"
          data-toggle="collapse"
          href=""
          aria-expanded="true"
          aria-controls=""
          @click="handleScrollSidebar('up')">
          <img src="static/image/teaching_center/arrow_up_1.png" alt="向上滚动" title="向上滚动">
        </div>
        <ul v-if="hasPermission" id="" class="menu-list collapse show">
          <li v-for="(item, index) in sidebarList" :class="( (index+1) <= sideBarCurrIndex[1] && (index+1) >= sideBarCurrIndex[0] ) ?'':'menu-item-none'" :key="index" :title="item.name" :href="(item.sideType && item.sideType == 'screenRecordingTool') ? (item.href) : ''" class="menu-item" @click="handleOpenSidebar(item)">
            <!-- <img src="static/image/teaching_outline.png" alt="教学大纲" title="教学大纲"> -->
            <i :class="[item.icon]" style="font-size:23px;"/>
            <p class="hiddenText">{{ item.name }}</p>
          </li>
        </ul>
        <div
          v-if="hasPermission"
          class="menu-item-arrow-box"
          role="button"
          data-toggle="collapse"
          href=""
          aria-expanded="true"
          aria-controls=""
          @click="handleScrollSidebar('down')">
          <img src="static/image/teaching_center/arrow_down_1.png" alt="向下滚动" title="向下滚动">
        </div>
      </div>

    </div>
    <modal-dialog
      id="upgrade-pkg-dialog"
      title="采用教学包版本切换"
      @cancel="cancelUpgradePkg"
      @submit="doUpgradePkg">
      <div slot="main">
        <div style="display: flex; padding: 20px 10px;">
          <div style="width:20%;line-height:40px;">版本选择：</div>
          <el-select v-model="value" placeholder="请选择" style="width: 80%">
            <el-option
              v-for="item in upgradeList"
              :key="item.pkgId"
              :label="item.pkgName"
              :value="item.pkgId">
              <template>
                <div>
                  {{ item.pkgName }}
                  <el-tag v-if="item.isInUseing" type="success" size="mini" effect="plain">使用中</el-tag>
                </div>
              </template>
            </el-option>

          </el-select>
        </div>
      </div>
    </modal-dialog>
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      title="新增思维导图"
      width="80%">
      <mindmap v-model="mindmapData" height="500" stroke-width="2"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :visible.sync="empiricalDialogVisible" :before-close="function (){ empiricalDialogVisible = false }" title="设置经验值" width="80%">

      <div class="textAlignLeft">
        <div class="empirical-setting-all-percent">
          <i :class="['el-icon-success',empiricalSettingPercentListAll === 100?'color-67c23a':'color-dc3545']"/>
          <span>  总权重需100%，当前总和</span>
          <span :class="[empiricalSettingPercentListAll === 100?'color-67c23a':'color-dc3545']">  {{ empiricalSettingPercentListAll }}%</span>
        </div>
        <div v-for="(item0, index0) in empiricalSettingLabelListata" :key="index0" class="empirical-setting-item">
          <div class="empirical-setting-item-one">{{ item0.name }}</div>
          <div class="empirical-setting-item-two">

            <input v-model.number="item0.weight" :min="0" type="number" onkeyup="this.value= (+((this.value+'').replace(/^(0+)|[^\d]+/g,'')))" @input="percentValueChange($event,'list',index0)">%
            <!-- oninput="if(this.value>100){this.value=100}" -->

            <!-- <el-input type="number" v-model.number="item0.weight" :min="0" :max="100" auto-complete="off" @change="percentValueChange($event,'list')" onkeyup="this.value= (+((this.value+'').replace(/^(0+)|[^\d]+/g,'')))"  :oninput="percentValueChange" clearable></el-input>% -->

            <!-- if(!this.value){this.value=0} else { this.value= (+((this.value+'').replace(/^(0+)|[^\d]+/g,'')));  if(this.value>100){this.value=100}   }  -->

            <!--   oninput="if(!this.value){this.value=0} else if(this.value>100){this.value=100} else { this.value= (+((this.value+'').replace(/^(0+)|[^\d]+/g,''))) }"  -->

            <!-- <el-input-number v-model="item0.weight" controls-position="right" :min="0" :max="100" @change="percentValueChange($event,'list')"></el-input-number >% -->

          </div>
          <div class="empirical-setting-item-three">
            <span v-for="(item1, index1) in item0.children" :key="index1">
              <span>{{ item1.name }}</span>
              <!-- onkeyup="this.value= (+((this.value+'').replace(/\D/g,'')))" -->

              <!-- <el-input type="number" v-if="!item1.flag" placeholder="" :min="0" auto-complete="off" v-model.number="item1.value" clearable onkeyup="this.value= (+((this.value+'').replace(/^(0+)|[^\d]+/g,'')))"  oninput="if(!this.value){this.value=0} else { this.value= (+((this.value+'').replace(/^(0+)|[^\d]+/g,'')));   } " ></el-input> -->

              <input
                v-if="!item1.flag"
                :min="0"
                v-model.number="item1.value"
                type="number"
                oninput="if (!this.value) {
                this.value = 0;
              } else {
                this.value = (+(  (this.value+'').replace(/^(0+)|[^\d]+/g,'')  )) ;
                if (this.value > 100) {
                  this.value = 100;
                }
              }"
                onkeyup="this.value= (+((this.value+'').replace(/^(0+)|[^\d]+/g,'')))">
              <span v-if="!item1.flag">分</span>
              <span v-if="index1 < item0.children.length - 1">；</span>
            </span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="empiricalDialogVisible = false">取 消</el-button>
        <el-button :loading="editLoading" type="primary" @click="empiricalDialogConfirm('empirical')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :visible.sync="settiongsDialogVisible" :before-close="function (){ settiongsDialogVisible = false }" title="课堂设置" top="5vh" width="80%">
      <el-tabs v-model="activeNameSettings" tab-position="left" @tab-click="handleClickSettingsTab">
        <el-tab-pane label="设置经验值" name="empiricalSetting">
          <div class="textAlignLeft settiongsDialogContentWrapper" >
            <div class="empirical-setting-all-percent">
              <i :class="['el-icon-success',empiricalSettingPercentListAll === 100?'color-67c23a':'color-dc3545']"/>
              <span>  总权重需100%，当前总和</span>
              <span :class="[empiricalSettingPercentListAll === 100?'color-67c23a':'color-dc3545']">  {{ empiricalSettingPercentListAll }}%</span>
            </div>
            <div v-for="(item0, index0) in empiricalSettingLabelListata" :key="index0" class="empirical-setting-item">
              <div class="empirical-setting-item-one">{{ item0.name }}</div>
              <div class="empirical-setting-item-two">

                <input v-model.number="item0.weight" :min="0" type="number" onkeyup="this.value= (+((this.value+'').replace(/^(0+)|[^\d]+/g,'')))" @input="percentValueChange($event,'list',index0)">%
                <!-- oninput="if(this.value>100){this.value=100}" -->

                <!-- <el-input type="number" v-model.number="item0.weight" :min="0" :max="100" auto-complete="off" @change="percentValueChange($event,'list')" onkeyup="this.value= (+((this.value+'').replace(/^(0+)|[^\d]+/g,'')))"  :oninput="percentValueChange" clearable></el-input>% -->

                <!-- if(!this.value){this.value=0} else { this.value= (+((this.value+'').replace(/^(0+)|[^\d]+/g,'')));  if(this.value>100){this.value=100}   }  -->

                <!--   oninput="if(!this.value){this.value=0} else if(this.value>100){this.value=100} else { this.value= (+((this.value+'').replace(/^(0+)|[^\d]+/g,''))) }"  -->

                <!-- <el-input-number v-model="item0.weight" controls-position="right" :min="0" :max="100" @change="percentValueChange($event,'list')"></el-input-number >% -->

              </div>
              <div class="empirical-setting-item-three">
                <span v-for="(item1, index1) in item0.children" :key="index1">
                  <span>{{ item1.name }}</span>
                  <!-- onkeyup="this.value= (+((this.value+'').replace(/\D/g,'')))" -->

                  <!-- <el-input type="number" v-if="!item1.flag" placeholder="" :min="0" auto-complete="off" v-model.number="item1.value" clearable onkeyup="this.value= (+((this.value+'').replace(/^(0+)|[^\d]+/g,'')))"  oninput="if(!this.value){this.value=0} else { this.value= (+((this.value+'').replace(/^(0+)|[^\d]+/g,'')));   } " ></el-input> -->

                  <input
                    v-if="!item1.flag"
                    :min="0"
                    v-model.number="item1.value"
                    type="number"
                    oninput="if (!this.value) {
                    this.value = 0;
                  } else {
                    this.value = (+(  (this.value+'').replace(/^(0+)|[^\d]+/g,'')  )) ;
                    if (this.value > 100) {
                      this.value = 100;
                    }
                  }"
                    onkeyup="this.value= (+((this.value+'').replace(/^(0+)|[^\d]+/g,'')))">

                  <span v-if="!item1.flag">分</span>
                  <span v-if="index1 < item0.children.length - 1">；</span>
                </span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="设置助教权限" name="assistantPermissionsSetting">
          <div class="textAlignLeft settiongsDialogContentWrapper">
            <el-tree ref="assiPermSettingTree" :data="assiPermSettingData" :props="defaultPropsAssiPermSetting" :default-expanded-keys="assiPermSettingExpandedKeys" :check-on-click-node="true" show-checkbox node-key="menuId" highlight-current />
            <!-- :check-strictly="false"  :default-checked-keys="assiPermSettingCheckedKeys"  -->
          </div>
        </el-tab-pane>
        <!--<el-tab-pane label="设置各种排序" name="setOrder">
          <div class="textAlignLeft settiongsDialogContentWrapper">
            课堂成员排序设置（注意：助教和待审核的成员依旧优先展示）<br>
            <el-radio-group v-model="classroomSetting.radio1">
              <el-radio :label="1">根据经验值</el-radio>
              <el-radio :label="2">根据学员名称</el-radio>
              <el-radio :label="3">根据手机号码</el-radio>
              <el-radio :label="4">根据加入课堂时间</el-radio>
            </el-radio-group>
            <el-radio-group class="sort-chose" v-model="classroomSetting.radio2">
              <el-radio label="up">升序</el-radio>
              <el-radio label="down">降序</el-radio>
            </el-radio-group>
          </div>
        </el-tab-pane>-->
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="settiongsDialogVisible = false">取 消</el-button>
        <el-button :loading="editLoading" type="primary" @click="settiongsDialogConfirm">提交</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="boardDialogVisible"
      :fullscreen="boardDialogFullScreen"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="function (){ boardDialogVisible = false;boardDialogFullScreen = false; }"
      title="教学白板"
      width="80%"
      class="boardDialogWrapper">
      <div :class="boardDialogFullScreen?'board-area-full':''" class="board-area">
        <!-- http://frp.creatorblue.com/XBoard/    XBoardSrc   -->
        <iframe id="boardDialog" :src="XBoardSrc" allow="camera;microphone" class="board-area-iframe"/>

      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="boardDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="boardDialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>

    <img id="teachingBaseImgId" :src="base64Canvas" style="display:none;" >

  </div>
</template>

<script>
import { baseUrl, toast, preventBackgroundScrolling, doMainUrl, openFilePreview } from '@/utils/global'
import $ from '../../assets/jquery-vendor'
import CbEditor from '@/components/cb-editor'
import headernav2 from '@/components/header-nav-start-class'

// 引入 截图 组件
// import ScreenShort from 'js-web-screen-shot';

import RingLing from '@/components/ring-ling'
import teachingMaterial from '@/views/my-teaching-package/teaching-material'
import publishTeachingPackage from '@/views/my-teaching-package/publish-teaching-package'
import activityLibrary from '@/views/activity/index'
import Message from '@/views/teaching-center/message'
import classroomMembers from '@/views/teaching-center/classroom-members'
import CloudDisk from '@/views/teaching-center/cloud-disk'
import FooterNav from '@/components/footer-nav-not-info'
import Activity from '@/views/activity' // 投票问卷
// 引入模态框组件页面
import ModalDialog from '@/components/modal-dialog'
// 引入思维导图组件
import mindmap from '@hellowuxin/mindmap'
// import axios from 'axios'

const toXBoardName = 'budaosToXboardMessage' // window.postMessage 发送给 【白板】 参数originName 的名称
const fromXBoardName = 'xboardToBudaosMessage' // window.postMessage【白板】 发送给 【布道师】 参数originName 的名称
const XBoardSrcQuery = '/XBoard/?customFullScreen=true&toName=' + toXBoardName + '&fromName=' + fromXBoardName + '&doMainUrl=' // 教学白板 弹窗的url的参数

export default {
  name: 'TeachingrDetail',
  components: {
    'cb-editor': CbEditor,
    'header-nav2': headernav2,
    'ring-ling': RingLing,
    'teaching-material': teachingMaterial,
    'activity-library': activityLibrary,
    'message': Message,
    'classroom-members': classroomMembers,
    'footer-nav': FooterNav,
    'activity-modules': Activity,
    'publish-teaching-package': publishTeachingPackage,
    'modal-dialog': ModalDialog,
    'cloud-disk': CloudDisk,
    'mindmap': mindmap
  },
  filters: {
    groupSerialNum: function(value) {
      if (value > 9) return '0' + value
      else if (value > 99) return value
      else return '00' + value
    },
    // 字符串截取省略
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 8) {
        return value.slice(0, 8) + '..'
      }
      return value
    }
  },
  data() {
    return {
      base64Canvas: '',
      classroomSetting: {
        radio1: 1,
        radio2: 'up'
      },
      currIndex: 0, // 当前选中的导航下标
      editLoading: false,
      empiricalSettingPercentAll: 0,
      empiricalSettingPercentListAll: 0, // 经验值设置总权重的和
      empiricalSettingDataFormData: {}, // 经验值设置弹窗 的 值
      empiricalSettingLabelListata: [], // 经验值设置弹窗 的文本信息
      empiricalDialogVisible: false, // 是否打开经验值设置编辑弹窗
      mindmapData: [{ 'name': '如何学习D3' }], // 思维导图数据
      dialogVisible: false, // 是否打开思维导图编辑弹窗
      refPkgVersion: '',
      value: '',
      upgradeList: [],
      modalWidth: '40%',
      isClassroomDetail: true,
      isDownUnfold: true,
      ct_id: '', // 课堂id
      classId: '',
      pkgId: '', // 当前教学包主键
      classroomInfo: {}, // 课堂信息
      teacherInfo: {}, // 教师信息
      classInfo: {}, // 班级信息
      pkgInfo: {}, // 教学包信息
      subjectId: '',
      hasPermission: true, // 权限
      hasPermissionActual: false,
      tabPanelId: '', // 四个tab的id
      studentNum: 0, // 课堂人数
      newMsgCount: 0, // 消息的未读数量
      cloudPanNum: 0,
      isFromMsgCommModalAct: false, // 是否来自公共弹窗的活动类消息点击确定按钮
      isClassroomFinished: false, // 课堂是否已结束
      activeNameSettings: 'empiricalSetting', // 经验值设置、助理权限设置 等 设置的 tab 的 选中项
      settiongsDialogVisible: false, //  经验值设置、助理权限设置 等 设置  弹窗 是否 显示
      defaultPropsAssiPermSetting: {
        label: 'name',
        children: 'children'
      }, // 助理权限设置 树 配置选项
      assiPermSettingData: [], // 助理权限设置 树 数据
      assiPermSettingCheckedKeys: [], // 助理权限设置 树   默认勾选的节点的 key 的数组
      assiPermSettingExpandedKeys: [], // 助理权限设置 树   默认展开的节点的 key 的数组
      boardDialogVisible: false, //  教学白板弹窗 是否 显示
      boardDialogFullScreen: false, // 教学白板 弹窗 是否 全屏
      XBoardSrc: doMainUrl + XBoardSrcQuery + doMainUrl, // 教学白板 弹窗的url
      // XBoardSrc: 'http://192.168.1.3:8082' + XBoardSrcQuery + doMainUrl, // 教学白板 弹窗的url
      screenShotPlugin: null, // 截图工具 对象
      sidebarListComm: [
        // {name: '经验值设置', icon: 'el-icon-setting', isCustom: true, sideType: 'empiricalValueSetting'},
        { name: '课堂设置', icon: 'el-icon-setting', isCustom: true, sideType: 'classroomSetting' },
        { name: '教学白板', icon: 'el-icon-date', isCustom: true, sideType: 'teachingWhiteboard' },
        { name: '截图工具', icon: 'el-icon-scissors', isCustom: true, sideType: 'screenshotTool' },
        { name: '录屏工具', icon: 'el-icon-video-camera', isCustom: true, sideType: 'screenRecordingTool', href: 'CustomRecorder://' }
      ], // 侧边栏数据
      sidebarList: [], // 侧边栏数据
      rightShortcutPane: [], // 右侧快捷面板信息
      sideBarShowNum: 5, // 右边侧边栏 显示几个 快捷面板 数量
      sideBarCurrIndex: [1, this.sideBarShowNum] // 右侧快捷面板 显示数据的 下标集合
    }
  },
  watch: {
    dialogVisible(val) {
      preventBackgroundScrolling(val)
    },
    empiricalDialogVisible(val) {
      preventBackgroundScrolling(val)
    },
    settiongsDialogVisible(val) {
      preventBackgroundScrolling(val)
    },
    boardDialogVisible(val) {
      preventBackgroundScrolling(val)
    },
    boardDialogFullScreen(val) {
      document.getElementById('boardDialog').contentWindow.postMessage({ name: 'fullScreenParent', originName: toXBoardName, isFullScreen: val }, '*')
      //  window.postMessage({ name: 'fullScreen',isFullScreen: _t.isFullScreen}, '*')
    }
  },
  destroyed() {
    // localStorage.setItem('isShowActMsgModal', 'false')
    //  console.log('teaching关闭事件beforeDestroy')
    window.removeEventListener('message', function(event) {
    }, false)
  },
  created() {
    // // 判断是否已经引入  截图 组件
    // let scriptList = document.getElementsByTagName('script');
    // let hasScreenShort = false;
    // if (scriptList && scriptList.length > 0) {
    //   for (let i=0;i< scriptList.length; i++) {
    //     // console.log(scriptList[i].src)
    //     if ((scriptList[i].src).indexOf('js-web-screen-shot/screenShotPlugin') > -1 ) {
    //       hasScreenShort = true;
    //       break;
    //     }
    //   }
    // }
    // // console.log('hasScreenShort', hasScreenShort)
    // if (!hasScreenShort) {
    //    //引入 截图 组件
    //   let stys = document.createElement("script");
    //   stys.type = "text/javascript";
    //   stys.src = "../../../static/creatorblue/js-web-screen-shot/screenShotPlugin.umd.js";
    //   document.head.appendChild(stys);
    //   // document.body.appendChild(stys);
    // }

    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.isTeacher = userInfo.isTeacher
    this.pkgId = localStorage.getItem('pkgId')
    this.ct_id = localStorage.getItem('ct_id')
    this.subjectId = localStorage.getItem('subjectId')
    this.classId = localStorage.getItem('class_id')
    this.currIndex = 0
    if (localStorage.getItem('isShowActMsgModal') && localStorage.getItem('isShowActMsgModal') === 'true') {
      this.currIndex = 1
    }

    const that = this
    this.webSockets.sendSocketMessage({
      busitypeIndex: 14
    })
    window.eventBus.$on('eventBusReceivedMsgData', function(data) {
      that.handleMessBackData(data)
    })
    // 获取可更换的教学包
    this.queryUpgradeList()

    localStorage.removeItem('setChatDatas')
    this.viewPkgInfo()
    this.queryRightList()
  },
  mounted() {
    // console.log('document.domain', document.domain)
    // console.log('window.location.host', window.location.host)
    // console.log('location.host', location.host)

    if (location.href && location.href.indexOf('http://localhost') > -1) {
      // let n = location.href.indexOf('http://localhost')
      this.XBoardSrc = doMainUrl + XBoardSrcQuery + 'http://' + location.host
    }

    const that = this
    $('#nav-tab span').on('click', function(e) {
      e.preventDefault()
      localStorage.removeItem('setChatDatas')
      $(this).tab('show')
      that.tabPanelId = this.id
      if (that.tabPanelId === 'nav-message-tab') { // 消息
        that.currIndex = 3
        that.$refs.messageInterface.isShowMes()
      } else if (that.tabPanelId === 'nav-profile-tab') { // 活教材
        that.currIndex = 0
        if (that.$refs.teachingMaterialInterface) {
          // that.$refs.teachingMaterialInterface.isShowPage()
        }
      } else if (that.tabPanelId === 'nav-contact-tab') { // 活动
        that.currIndex = 1
        that.$refs.activityLibraryInterface.isShowPage()
      } else if (that.tabPanelId === 'nav-home-tab') { // 课堂成员
        that.currIndex = 2
        that.$refs.classroomMembersInterface.isShowPage()
      } else if (that.tabPanelId === 'nav-cloud-disk') { // 云盘
        that.currIndex = 4
        that.$refs.cloudDiskPage.isShowPage()
      } else if (that.tabPanelId === 'nav-teaching-pcks') { // 发布教学包
        that.currIndex = 5
        that.$refs.publishTeachingPackageInterface.toPublishPageOr()
      }
    })

    window.addEventListener('message', function(event) {
      if (event.data.originName && event.data.originName === fromXBoardName) {
        if (event.data.name && event.data.name === 'saveToCloudDisk') { // 保存 到云盘   saveToCloudDisk
          that.boardSaveFileToCloudDisk(event.data)
        } else if (event.data.name && event.data.name === 'fullScreen') { // 全屏
          that.boardDialogFullScreen = event.data.isFullScreen
        }
      }
    }, false)
  },
  methods: {
    /** 点击调用 录屏工具 */
    handleOpenScreenRecording: function(item) {
      // // 方法3： 需要使用node 调用程序
      // axios.get('http://localhost:5000').then(res => {
      //   console.log('res', res)
      // })

      window.protocolCheck(item.href, function() {
        // 没有 协议 给出 确认 提示
        var isDownLoad = window.confirm('无此插件，请下载程序！')
        if (isDownLoad) {
          openFilePreview('', '', '', true, `${baseUrl}uploads/download/recorder-1.0.5.exe`)
        }
      })

      // // 方法2： 使用注册表 调用exe，不安全
      // let a = document.createElement('a')
      // a.href = 'CustomRecorder://'
      // a.click()

      // // 方法1：只ie浏览器支持
      // var objShell = new ActiveXObject('WScript.Shell')
      // objShell.Run('C:\\Users\\creatorblue\\AppData\\Local\\Programs\\desktop-recorder\\recorder.exe')
    },
    /** 侧边栏点击 事件 */
    handleOpenSidebar(item) {
      if (item.isCustom) {
        if (item.sideType && item.sideType === 'empiricalValueSetting') { // 经验值设置
          this.handleOpenEmpiricallDialog('empirical')
        } else if (item.sideType && item.sideType === 'classroomSetting') { // 课堂设置
          this.handleOpenSettiongsDialog()
        } else if (item.sideType && item.sideType === 'teachingWhiteboard') { // 教学白板
          this.boardDialogVisible = true
        } else if (item.sideType && item.sideType === 'screenshotTool') { // 截图工具
          this.handleOpenScreenShortDialog()
        } else if (item.sideType && item.sideType === 'screenRecordingTool') { // 录屏工具
          this.handleOpenScreenRecording(item)
        }
      } else {
        this.handleOpenSyllabus(item.name)
      }
    },
    /** 侧边栏 快捷面板 滚动 */
    handleScrollSidebar(type) {
      if (type === 'up') { // 向上滚动
        this.sideBarCurrIndex[1] = (this.sideBarCurrIndex[1] - (this.sideBarShowNum) > (this.sideBarShowNum)) ? (this.sideBarCurrIndex[1] - (this.sideBarShowNum)) : (this.sideBarShowNum)
        // this.sideBarCurrIndex = (this.sideBarCurrIndex - 1 > 1) ? (this.sideBarCurrIndex - 1) : 1
      } else if (type === 'down') { // 向下滚动
        const max = (Math.ceil((this.sidebarList.length) / (this.sideBarShowNum))) * (this.sideBarShowNum)

        this.sideBarCurrIndex[1] = (this.sideBarCurrIndex[1] + (this.sideBarShowNum) < max) ? (this.sideBarCurrIndex[1] + (this.sideBarShowNum)) : max
        // this.sideBarCurrIndex = (this.sideBarCurrIndex + 1 < max) ? (this.sideBarCurrIndex + 1) : max
      }
      this.sideBarCurrIndex[0] = this.sideBarCurrIndex[1] - (this.sideBarShowNum - 1)
      this.$forceUpdate()
    },
    /** 进入直播 */
    clickLinkUrl(url) {
      window.open(url)
    },
    /** 点击调用截图工具 */
    handleOpenScreenShortDialog: function() {
      const that = this
      // 参考 https://www.npmjs.com/package/js-web-screen-shot
      that.screenShotPlugin = new screenShotPlugin({
        enableWebRtc: false,
        level: 9998,
        triggerCallback: (res) => {
          if (res && res.code === 0) {
            //
          }
        }
      })
      // that.screenShotPlugin = new screenShotPlugin({enableWebRtc: false,level:9998, completeCallback: (base64) => {
      //   that.base64Canvas = base64;
      //     // toast('小猿正在努力赶工中...')

      //   if (document.body.createControlRange) { //IE 11 需要有个img标签
      //         var controlRange;
      //         var imgs = document.getElementById('teachingBaseImgId');
      //         imgs.onload = function () {
      //             controlRange = document.body.createControlRange();
      //             imgs.contentEditable = 'true';
      //             controlRange.addElement(imgs);
      //             try {
      //                 var successful = controlRange.execCommand('copy');
      //                 var msg = successful ? 'successful' : 'unsuccessful';
      //                 console.log('Copying text command was ' + msg);
      //             } catch (err) {
      //                 console.log(err);
      //             }
      //         }
      //         imgs.src = base64 //'data:image/png;base64,' + base64;
      //     }
      //     else { //chrome
      //         const blobInput = convertBase64ToBlob(base64, 'image/png');
      //         const clipboardItemInput = new ClipboardItem({ 'image/png': blobInput });
      //         navigator.clipboard.write([clipboardItemInput]);
      //         console.log('success');
      //     }

      //     function convertBase64ToBlob(base64, type) {
      //       let arr = base64.split(',')
      //         var bytes = window.atob(arr[1]);
      //         var ab = new ArrayBuffer(bytes.length);
      //         var ia = new Uint8Array(ab);
      //         for (var i = 0; i < bytes.length; i++) {
      //             ia[i] = bytes.charCodeAt(i);
      //         }
      //         return new Blob([ab], { type: type });
      //     }

      // }})
    },
    boardSaveFileToCloudDisk(params) { // 教学白板 保存到云盘
      // lastModified: 1590717708000
      // lastModifiedDate: Fri May 29 2020 10:01:48 GMT+0800 (中国标准时间) {}
      // name: "add-cir.png"
      // size: 1277
      // type: "image/png"
      // uid: 1621416479821
      // webkitRelativePath: ""

      // 限制文件上传大小    小于200m
      if (parseInt(params.blob.size) > (200 * 1024 * 1024)) {
        toast('上传的文件不能大于200M')
        return
      }
      params.blob.name = params.fileName // +'.pmg'
      // 创建接口调用所需的传参数据
      const formData = new FormData()
      formData.append('file', params.blob)
      // formData.append('dirId', '');
      formData.append('type', 'baiban')

      formData.append('pkgId', this.pkgId)
      // 调用文件上传接口
      this.$api.cloudDisk.uploadFile(formData, (progress) => {
        // if (progress) {     //显示文件进度条
        //   params.onProgress({percent: progress})
        // }
      }, (cancel) => { // 取消文件上传
        // 取消文件上传事件  存入当前文件中
        // params.file.cancelFun = cancel;
        // that.fileList.push(params.file);
      }, true).then(res => {
        if (res.code === 0) {
          // 显示该文件上传成功
        } else {
          // 显示该文件上传失败
          params.onError()
        }
        toast(res.msg)
      }).catch(() => {
        // 移出上传异常的文件
      })
    },
    /** 助理权限设置 弹窗  显示  获取数据 */
    handleOpenAssiPermDialog: function() {
      this.assiPermSettingData = []
      this.assiPermSettingCheckedKeys = []
      this.assiPermSettingExpandedKeys = []

      const formData = new FormData()
      formData.append('ctId', this.ct_id)
      this.$api.classroom.viewAssiPermsSetting(formData).then(res => {
        if (res.code === 0) {
          this.assiPermSettingCheckedKeys = (res.data && res.data.selectedList && res.data.selectedList.length > 0) ? (res.data.selectedList) : [] // ["1a1"]; //

          this.assiPermSettingExpandedKeys = (res.data && res.data.defaultExpandedKeys && res.data.defaultExpandedKeys.length > 0) ? (res.data.defaultExpandedKeys) : []

          this.assiPermSettingData = (res.data && res.data.treeData && res.data.treeData.length > 0) ? (res.data.treeData) : []

          this.$nextTick(() => {
            this.assiPermSettingCheckedKeys.forEach((item, index) => {
              this.$refs.assiPermSettingTree.setChecked(item, true, false)
            })
            this.$forceUpdate()
          })
          // this.$refs.assiPermSettingTree.setCheckedKeys( this.assiPermSettingCheckedKeys,true);
        } else {
          toast(res.msg)
        }
      })
    },
    /** 助理权限设置 弹窗 点击确定按钮 */
    assiPermDialogConfirm: function(name) {
      // console.log('this.getCheckedKeys', this.$refs.assiPermSettingTree.getCheckedKeys())
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        this.editLoading = true
        const params = {
          ctId: this.ct_id,
          menuIdList: this.$refs.assiPermSettingTree.getCheckedKeys().concat(this.$refs.assiPermSettingTree.getHalfCheckedKeys())
        }
        //
        this.$api.classroom.saveAssiPermsSetting(params).then(res => {
          toast(res.msg)
          this.editLoading = false
        }).catch((err) => {
          toast(err)
          this.editLoading = false
        })
      })
    },
    /** 经验值设置、助理权限设置 等 设置  弹窗 点击确定 */
    settiongsDialogConfirm: function() {
      if (this.activeNameSettings === 'empiricalSetting') {
        this.empiricalDialogConfirm('settiongs')
      } else if (this.activeNameSettings === 'assistantPermissionsSetting') { // 显示 助理权限设置
        this.assiPermDialogConfirm('settiongs')
      }
      // 设置各种排序
      if (this.activeNameSettings === 'setOrder') {
        this.saveClassroomSetting()
      }
    },
    /** tab 被选中时触发 */
    handleClickSettingsTab: function(tab, event) {
      if (this.activeNameSettings === 'empiricalSetting') { // 显示 经验值设置
        this.handleOpenEmpiricallDialog('settiongs')
      } else if (this.activeNameSettings === 'assistantPermissionsSetting') { // 显示 助理权限设置
        this.handleOpenAssiPermDialog('settiongs')
      }
      // 设置各种排序
      if (this.activeNameSettings === 'setOrder') {
        this.handleViewSetting()
      }
    },
    /** 经验值设置、助理权限设置 等 设置  弹窗 显示 */
    handleOpenSettiongsDialog: function() {
      this.settiongsDialogVisible = true
      this.activeNameSettings = 'empiricalSetting'
      // 显示 经验值设置
      this.handleOpenEmpiricallDialog('settiongs')
      // this.handleOpenAssiPermDialog('settiongs');
    },
    /** 设置经验值弹窗 */
    handleOpenEmpiricallDialog: function(name) {
      this.empiricalSettingPercentListAll = 0
      this.empiricalSettingLabelListata = []
      const formData = new FormData()
      formData.append('ctId', this.ct_id)
      this.$api.classroom.viewEmpiricalSetting(formData).then(res => {
        if (res.code === 0) {
          this.empiricalSettingLabelListata = (res.data && res.data.length > 0) ? (res.data) : []
          this.percentValueChange()
          if (name && name === 'empirical') {
            this.empiricalDialogVisible = true
          }
        } else {
          toast(res.msg)
        }
      })
    },
    /** 权重输入框 的change事件 */
    percentValueChange: function(event, type, index) {
      if (index || index === 0) {
        if (!this.empiricalSettingLabelListata[index].weight) {
          this.empiricalSettingLabelListata[index].weight = 0
        } else {
          const weight = this.empiricalSettingLabelListata[index].weight
          this.empiricalSettingLabelListata[index].weight = (+((weight + '').replace(/^(0+)|[^\d]+/g, '')))
          if (this.empiricalSettingLabelListata[index].weight > 100) {
            this.empiricalSettingLabelListata[index].weight = 100
          }
        }
      }
      this.empiricalSettingPercentListAll = 0
      this.empiricalSettingLabelListata.forEach((item, index) => {
        this.empiricalSettingPercentListAll = this.empiricalSettingPercentListAll + (+item.weight)
      })
    },
    /** 设置经验值弹窗 点击确定按钮 */
    empiricalDialogConfirm: function(name) {
      if (this.empiricalSettingPercentListAll !== 100) {
        toast('总权重需100%，当前总和' + this.empiricalSettingPercentListAll + '%')
        return false
      }
      const list = []
      if (this.empiricalSettingLabelListata && this.empiricalSettingLabelListata.length > 0) {
        for (let i = 0; i < this.empiricalSettingLabelListata.length; i++) {
          const item = this.empiricalSettingLabelListata[i]
          const children = []
          if (item.children && item.children.length > 0) {
            for (let c = 0; c < item.children.length; c++) {
              const itemc = item.children[c]
              if (!itemc.flag) {
                if ((!itemc.value || itemc.value === null || itemc.value === undefined) && (itemc.value !== 0)) {
                  toast('【' + item.name + '】的【' + itemc.name + '】不能为空')
                  return false
                }
                children.push({
                  stId: itemc.stId,
                  value: (itemc.value) ? (itemc.value) : 0
                })
              }
            }
          }
          list.push({
            typeId: item.typeId,
            weight: (item.weight) ? (item.weight) : 0,
            children: children
          })
        }
      }
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        this.editLoading = true
        const params = {
          ctId: this.ct_id,
          list: list
        }
        this.$api.classroom.saveSetting(params).then(res => {
          if (res.code === 0) {
            toast('经验值设置成功')
          } else if (res.msg) {
            toast(res.msg)
          }
          this.empiricalDialogVisible = false
          this.editLoading = false
        }).catch((err) => {
          toast(err)
          this.empiricalDialogVisible = false
          this.editLoading = false
        })
      })
    },
    /** 合并 列  */
    empiricalSettingSpanMethod: function({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        if (rowIndex === 0) {
          return {
            rowspan: 3,
            colspan: 1
          }
        } else if (rowIndex === 3) {
          return {
            rowspan: 4,
            colspan: 1
          }
        } else if (rowIndex === 7) {
          return {
            rowspan: 7,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    // 思维导图关闭前的事件
    handleClose() {
    },
    unreadNumAdd: function(event) {
      const that = this
      setTimeout(function() {
        that.webSockets.sendSocketMessage({
          busitypeIndex: 14
        })
      }, 1000)
      // if (event.messageList && event.messageList.length > 0) {
      //   this.newMsgCount = 0
      //   event.messageList.forEach((item, index) => {
      //     this.newMsgCount = this.newMsgCount + parseInt(item.unread_num)
      //   })
      // }
      // this.newMsgCount = this.newMsgCount + 1
    },
    // 设置课堂人数
    setClassroomStudentNum(value) {
      this.studentNum = value
    },
    // 获取可更换的版本
    changeVersion(val) {
      $('#upgrade-pkg-dialog').modal('show')
    },
    queryUpgradeList() {
      const formData = new FormData()
      formData.append('ctId', this.ct_id)
      formData.append('pkgId', this.pkgId)
      this.$api.pkgInfo.queryUpgradeList(formData).then(res => {
        if (res.code === 0) {
          this.upgradeList = res.data
          this.upgradeList.forEach(item => {
            if (item.isInUseing) {
              this.value = item.pkgId
            }
          })
        }
      })
    },
    // 更新版本
    doUpgradePkg() {
      if (!this.value) {
        return false
      }
      const formData = new FormData()
      formData.append('ctId', this.ct_id)
      formData.append('pkgId', this.value)
      this.$api.pkgInfo.doUpgradePkg(formData).then(res => {
        if (res.code === 0) {
          // 重新将缓存中的值替换
          localStorage.setItem('subjectId', res.data.subjectId)
          // 重新加载本页面
          // window.location.reload()
          toast(res.msg + '，1秒后重新加载数据')
          setTimeout(() => {
            // 重新加载本页面
            window.location.reload()
          }, 1000)
        } else {
          toast(res.msg)
        }
      })
    },
    // 取消更换版本
    cancelUpgradePkg() {
      $('#upgrade-pkg-dialog').modal('hide')
    },
    closeModal() {
      this.$refs.codeModal.cancelCodeModal()
    },
    previewPicture() {
      this.$refs.codeModal.changeCodeModal()
      $('#preview-picture-box').modal('show')
    },
    handleUnfold() {
      if (this.isDownUnfold) {
        this.isDownUnfold = false
      } else {
        this.isDownUnfold = true
      }
    },
    handleUpdateInfo() {
      this.viewPkgInfo()
    },
    /** 去云盘 */
    toCloudDisk: function() {
      this.$router.push({
        path: '/teaching-center/cloud-disk'
      })
    },
    /** 处理 返回的消息数据 */
    handleMessBackData: function(res) {
      const that = this
      if (res.busitypeIndexNew === 14 || res.busitypeIndexNew === 19) { // 获取消息主界面列表数据
        if (res.code === 0) {
          if (res.data && res.data.msg && res.data.msg.length > 0) {
            for (let i = 0; i < res.data.msg.length; i++) {
              if (res.busitypeIndexNew === 14) {
                that.newMsgCount = (res.data.msg[i] && res.data.msg[i].unReadNum) ? (res.data.msg[i].unReadNum) : 0
              } else if (res.busitypeIndexNew === 19) {
                if (res.data.msg[i].ctId && that.ct_id && this.ct_id === res.data.msg[i].ctId) {
                  that.$router.push({
                    path: '/my/learning-classroom'
                  })
                }
              }
            }
          }
        }
      }
    },
    // 教学包信息
    viewPkgInfo() {
      this.$api.classroom.viewClassroomInfo(this.ct_id).then(res => {
        if (res.code === 0) {
          if (res.data) {
            res.data.classroomInfo.pic = baseUrl + res.data.classroomInfo.pic
            res.data.classroomInfo.qrCode = baseUrl + res.data.classroomInfo.qrCode
            this.refPkgVersion = res.data.refPkgVersion
            this.studentNum = res.data.numData.traineeNum
            this.cloudPanNum = res.data.numData.cloudPanNum
            this.classroomInfo = res.data.classroomInfo
            // this.isClassroomFinished = (res.data.classroomInfo.classroomState === '3' ? true : false)
            this.isClassroomFinished = false
            if (res.data.classroomInfo.classroomState === '3') {
              this.isClassroomFinished = true
            }
            this.teacherInfo = res.data.teacherInfo
            this.classInfo = res.data.classInfo
            this.pkgInfo = res.data.pkgInfo
            this.hasPermission = res.data.hasPermission
            this.hasPermissionActual = res.data.hasPermissionActual
            const teacherPic = res.data.teacherInfo.teacherPic
            if (teacherPic && teacherPic.indexOf('https') === -1 && teacherPic.indexOf('http') === -1) {
              res.data.teacherInfo.teacherPic = baseUrl + teacherPic
            }
            const teachingAssistantPic = res.data.teacherInfo.teachingAssistantPic
            if (teachingAssistantPic.indexOf('https') === -1 && teachingAssistantPic.indexOf('http') === -1) {
              res.data.teacherInfo.teachingAssistantPic = baseUrl + teachingAssistantPic
            }
          }
        }
      })
    },
    /**
     *  打开云盘的教材大纲
     */
    handleOpenSyllabus(title) {
      if (this.tabPanelId !== 'nav-cloud-disk') {
        this.$refs['cloudDisk'].click()
      }
      this.$refs.cloudDiskPage.getLeftNavData(title)
    },
    // 查询右侧快捷面板信息
    queryRightList() {
      this.sideBarCurrIndex = [1, this.sideBarShowNum]
      // this.rightShortcutPane = []
      // this.sidebarList = JSON.parse(JSON.stringify(this.sidebarListComm))
      const formData = new FormData()
      formData.append('ctId', this.ct_id)
      this.$api.cloudDisk.queryRightList(formData).then(res => {
        if (res.code === 0) {
          this.rightShortcutPane = res.data
          this.sidebarList = JSON.parse(JSON.stringify(this.sidebarListComm))
          if (this.rightShortcutPane && this.rightShortcutPane.length > 0) {
            for (let i = 0; i < this.rightShortcutPane.length; i++) {
              if (this.rightShortcutPane[i].name.indexOf('教学大纲') > -1) {
                this.rightShortcutPane[i].icon = 'iconfont icon-zichan-quanbushebei'
              } else if (this.rightShortcutPane[i].name.indexOf('任务书') > -1) {
                this.rightShortcutPane[i].icon = 'iconfont icon-renwu'
              } else if (this.rightShortcutPane[i].name.indexOf('讲义PPT') > -1) {
                this.rightShortcutPane[i].icon = 'iconfont icon-ppt'
              } else if (this.rightShortcutPane[i].name.indexOf('实施计划') > -1) {
                this.rightShortcutPane[i].icon = 'iconfont icon-jihua'
              } else if (this.rightShortcutPane[i].name.indexOf('思维导图') > -1) {
                this.rightShortcutPane[i].icon = 'fa fa-themeisle'
              }

              this.sidebarList.push(this.rightShortcutPane[i])
            }
          }
        }
      })
    },
    // 保存排序设置
    saveClassroomSetting() {
      const formData = new FormData()
      formData.append('ctId', this.ct_id)
      formData.append('radio1', this.classroomSetting.radio1)
      formData.append('radio2', this.classroomSetting.radio2)
      this.$api.classroom.saveClassroomSetting(formData).then(res => {
        if (res.code === 0) {
          this.$message.success(res.msg)
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    handleViewSetting() {
      const params = {
        ctId: this.ct_id
      }
      this.$api.classroom.viewClassroomSetting(params).then(res => {
        if (res.code === 0) {
          this.classroomSetting.radio1 = Number(res.data.radio1)
          this.classroomSetting.radio2 = res.data.radio2
        }
      })
    }
  }
}
</script>

<style scoped>
    .teaching-center-box{
        height: 100%;
        background: #f5f5f5;
        padding-bottom: 20px;
    }
    .resouse-teach-nav{
        background-color: #f5f5f5;
    }
    .resouse-teach-nav .nav-tabs .nav-item{
        height:39px;
        line-height:39px;
        cursor: pointer;
        width: 130px;
    }
    .teaching-center{
        display: flex;
        justify-content: space-between;
        /* min-height: 70vh; */
        padding: 0;
        background-color: #fff;
        box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.1);
    }
    .left-teaching-center-con{
        width: 100%;
        height:100%;
        /* padding-top:15px; */
        border-radius: 5px;
        background: white;
        /* box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.1); */
    }
     .ringh-teaching-center-menu{
        position: fixed;
        top:180px;
        left:calc(((100vw - 1200px) / 2 + 1200px + 5px));
        z-index:666;
        min-width:70px;
        /* min-height:300px; */
        font-size: 14px;
        text-align: center;
    /*  border-radius: 5px; */
        background-color: #fff;
        /* padding: 10px 0; */
        box-shadow: 0 0px 13px 0 rgba(0, 0, 0, 0.1)
    }
    .ringh-teaching-center-menu .menu-item-arrow-box{
        width: 100%;
        height: 60px;
        line-height: 63px;
        background-color: #fbfbfb;
        cursor: pointer;
    }
    .ringh-teaching-center-menu .menu-list {
        transition: 0.4s;
        max-height: 392px;
        overflow-y: scroll;
    }
    .ringh-teaching-center-menu .menu-list .menu-item{
        cursor: pointer;
        padding:3px 0;
    }
    .ringh-teaching-center-menu .menu-list .menu-item > img{
        width:25px;
        height:25px;
    }
    .ringh-teaching-center-menu .menu-list .menu-item > p{
        font-size: 12px;
    }
    .ringh-teaching-center-menu .menu-list .menu-item:hover{
        color: #0079fe;
        background-color: #fbfbfb;
    }
    .ringh-teaching-center-menu .menu-list .menu-item > p{
        margin:7px 0;
    }
    .ringh-teaching-center-menu .menu-list .menu-item{
        padding-top: 10px;
        border-top: 1px solid #fafafa;
        /* border-top: 1px solid #eee; */
    }
    .ringh-teaching-center-menu .menu-list .menu-item-none{
      display: none !important;
    }
    /* 头部start */
    .header-box{
        display: flex;
        position: relative;
        background: white;
        margin:10px auto;
        text-align: left;
        overflow: hidden;
    }
    .header-box .serachLibrary{
        padding:5px;
    }
    .header-box .teaching-packa-img{
        width: 120px;
        height: 100px;
        margin-left: 10px
    }
    .header-box .teaching-packa-info{
        flex:1.3;
        margin: 0 20px;
        border-right: 1px solid #e0e0e0;
    }
    .header-box .teaching-packa-info >div{
        height: 33px;
        line-height: 33px;
        overflow: hidden;
    }
    .teaching-packa-info-name .name-info{
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .header-box .teaching-packa-info .teaching-packa-info-name{
        font-size: 20px;
        display: flex;
        align-items:center;
    }
    .header-box .teaching-packa-info .belong-to-department{
        font-size: 14px;
    }
    .header-box .teaching-packa-info .belong-to-department > span{
        display: inline-block;
        padding-right: 10px;
    }
    .header-box .edit-teaching-package-user{
        flex:1;
        height: 100px;
        border-right: 1px solid #e0e0e0;
    }
    .header-box .edit-teaching-package-teaching{
      flex: 1.3;
    }
    .header-box .edit-teaching-package-user{
        position: relative;
    }
    /* .header-box .edit-teaching-package-user .class-qrCode-box{
        display: inline-block;
    } */
    .header-box .edit-teaching-package-user .class-qrCode-box:hover .hover-class-qrCode{
        display: block;
    }
    .header-box .edit-teaching-package-user .hover-class-qrCode{
        display: none;
        position: absolute;
        right: -47px;
        top:0;
        z-index: 666;
        width:100px;
        height: 100px;
        text-align: center;
        box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.1);
        background-color: #fff;
    }
    .header-box .edit-teaching-package-user .hover-class-qrCode > img{
        width:100px;
        height:100px;
    }
    .header-box .edit-teaching-package-user .class-qrCode{
        width: 70px;
        height: 70px;
        cursor: pointer;
    }
    .header-box .edit-teaching-package-user .title{
        text-align: center;
        margin-top: 5px;
    }
    .header-box .edit-teaching-package-user .user-info-box{
        display: flex;
        justify-content: center;
        font-size: 12px;
        height: 50px;
        margin-top:25px;
    }
    .header-box .edit-teaching-package-user .user-info-box .user-info{
        display: flex;
        /* width: 30%; */
        height: 50px;
        margin:0px 10px;
    }
    .edit-teaching-package-user .user-info-box .user-info .user-img{
        border-radius: 20px;
        margin-top: 5px;
    }
    .edit-teaching-package-user .user-info-box .user-info .right-user-detail{
        margin-left:10px;
        font-size: 12px;
    }
    .edit-teaching-package-user .user-info-box .user-info .right-user-detail > div{
       height: 25px;
       line-height: 25px;
    }
    .header-box .edit-teaching-package-teaching .user-info{
      width: 50%;
      /* justify-content: flex-end;
      justify-content: center; */
    }
    .header-box .edit-teaching-package-teaching .user-info:first-child{
      justify-content: flex-end;
    }

    .right-teaching-package-info{
        flex:1;
        padding-left: 10px;
        font-size: 14px;
        text-align: left;
        margin-left: 20px;
    }
    .right-teaching-package-info > div{
        /* height: 30px;
        line-height: 30px; */
        padding: 6px 0px;
    }
    .teaching-package-state{
        position: absolute;
        top: 25px;;
        right:-43px;
        width: 184px;
        height:30px;
        line-height:30px;
        text-align: center;
        transform: rotate(40deg);
        background-color: #FF740E;
        color: #fff;
    }
    .teaching-package-state > span{
        display: inline-block;
    }
    /* 头部end */

    .change-version{
      float:right;
      font-size: 12px;
      padding-right: 15px;
      cursor: pointer;
    }
    /* 经验值设置弹窗样式 */
    .empirical-setting-all-percent{
      /* display: flex;
      align-items: center;
      width: auto; */
      background-color: #f5f5f5;
      border-radius: 20px;
      padding: 5px 10px;
      box-sizing: border-box;
      display: inline-block;
      margin-bottom: 10px;
      /* position: relative;
      left: 0; */
    }
    .empirical-setting-item{
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .empirical-setting-item-one{
      width: 10%;
      text-align: left;
      padding: 0 10px;
      box-sizing: border-box;
    }
    .empirical-setting-item-two{
      width: 15%;
      text-align: left;
    }
    .empirical-setting-item-two input,
    .empirical-setting-item-two /deep/ .el-input,
    .empirical-setting-item-two /deep/ .el-input-number{
      width: 80%;
    }
    .empirical-setting-item-two input{
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      color: #606266;
    }
    .empirical-setting-item-three{
      width: 75%;
      text-align: left;
      padding: 0 10px;
      box-sizing: border-box;
      line-height: 1.5rem;
    }
    .empirical-setting-item-three input{
      width: 100px;
      border: none;
      border-bottom: 1px solid #409EFF;
      height: 30px;
      line-height: 30px;
      padding: 0 15px;
      margin-left: 5px;
      margin-right: 5px;
      color: #606266;
    }

    .empirical-setting-item-three /deep/ .el-input{
      width: 100px;
      padding-left: 5px;
      padding-right: 5px;
      box-sizing: border-box;
    }
    .empirical-setting-item-three /deep/ .el-input .el-input__inner{
      border-top: none;
      border-left: none;
      border-right: none;
      border-bottom-color: #409EFF;
      height: 30px;
    }
    .empirical-setting-table{
      width: 100%;
      height: 100%;
      /* height: calc(100vh - 15vh - 50px - 54px - 140px); */
    }
    .hiddenText{
      width: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .settiongsDialogContentWrapper{
      padding-left: 10px;
      min-height: 220px;
      /* max-height: calc(100vh - 10vh - 54px - 60px - 70px);
      overflow-y: scroll; */
    }

    .boardDialogWrapper /deep/ .el-dialog{
      margin-top: 50px !important;
    }
    .boardDialogWrapper /deep/ .el-dialog.is-fullscreen{
      margin-top: 0px !important;
    }
    .boardDialogWrapper /deep/ .el-dialog__body{
      padding: 10px 20px 10px !important;
    }
    .board-area{
      /* margin-top: -20px; */
      /* margin-bottom: -10px; */
      box-sizing: border-box;
      min-height: 500px;
      height: calc(100vh - 54px - 50px - 50px - 20px);
      /* height: calc(100vh - 54px - 15vh - 50px - 40px); */
    }
    .board-area-full{
      /* margin-top: 50px !important; */
       height: calc(100vh - 54px - 20px);
    }
    .board-area-iframe{
      width: 100%;
      height: 100%;
      border-top: 1px solid rgb(238, 238, 238);
      border-left: 1px solid rgb(238, 238, 238);
    }
    .sort-chose{
      margin-left: 15px;
    }
</style>
