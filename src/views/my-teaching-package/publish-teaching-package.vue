<!-- 发布教学包页面 -->
<template>
  <div class="publish-teaching-package">
    <div v-if="showPcks" class="pck-min-height display-block" style="margin: 20px auto;width: 95%;">
      <div class="textAlignLeft borderBottom padding-bottom-10"><span class="pck1-span">什么是教学包</span></div>
      <div class="textAlignLeft padding-bottom-10 padding-top-10">
        &nbsp;&nbsp;&nbsp;&nbsp;教学包是一种基于实训云平台的全新的课程交流形式，具有引用高效、共享方便等特点。通过发布教学包，可以将您的
        教学资源和活动发布在学院教学包专区，便捷分享给其他老师，建立起与他们的课程交流。
      </div>
      <div class="textAlignLeft padding-bottom-10 padding-top-10">
        &nbsp;&nbsp;&nbsp;&nbsp;您可以选择需要打包的资源和活动，进行结构编辑后，选择到特定的机构发布或个人发布，并选择是否需要授权才能引用。发布的教学包通过审核后，就可以体验课程分享的乐趣了。来试一试吧！
      </div>
      <div class="textAlignLeft borderBottom padding-bottom-10 padding-top-10"><span class="pck1-span">教学包发布流程</span>
      </div>
      <div class="padding-bottom-10 padding-top-30 pcks2-div displayFlex justify-content-center">
        <div>
          <img src="static/creatorblue/img/techingPcks1.png"><br>
          <span>选择资源和活动</span>
        </div>
        <i class="fa fa-angle-double-right" aria-hidden="true"/>
        <div>
          <img src="static/creatorblue/img/techingPcks2.png"><br>
          <span>资源排序</span>
        </div>
        <i class="fa fa-angle-double-right" aria-hidden="true"/>
        <div>
          <img src="static/creatorblue/img/techingPcks3.png"><br>
          <span>选择云盘文件</span>
        </div>
        <i class="fa fa-angle-double-right" aria-hidden="true"/>
        <div>
          <img src="static/creatorblue/img/techingPcks4.png"><br>
          <span>选择发布方</span>
        </div>
        <i class="fa fa-angle-double-right" aria-hidden="true"/>
        <div>
          <img src="static/creatorblue/img/techingPcks5.png"><br>
          <span>填写基本信息</span>
        </div>
        <i class="fa fa-angle-double-right" aria-hidden="true"/>
        <div>
          <img src="static/creatorblue/img/techingPcks6.png"><br>
          <span>提交审核</span>
        </div>
      </div>
      <div class="padding-top-30 margin-bottom-15" style="cursor:pointer">
        <!--<span @click="toPublishPage()" class="publishPcks">马上发布教学包</span>-->
        <a class="fancy-button bg-gradient1" @click="toPublishPage()"><span><i class="fa fa-sign-in"/>马上发布教学包</span></a>
      </div>
    </div>
    <!--发布流程begin-->
    <div v-if="!showPcks" class="pck-min-height margin-top-10 display-block " style="margin: 18px auto;width: 95%;">
      <div class="pubulishED displayFlex">
        <div
          v-for="(item,index) in techingThreePublishName"
          :kid="index"
          :key="index"
          :class="index===0?'progressAll displayFlex':'progressAll displayFlex progressAllDivMarginLeft'">
          <div v-if="index != 0" class="progress1-sjx progress1-sjx2"/>
          <div class="progressAllDiv"><span>{{ item }}</span></div>
          <div v-if="index !== (techingThreePublishName.length-1)" class="progress1-sjx"/>
        </div>
      </div>
      <!--选择资源和活动begin-->
      <div v-show="PcksThree0">
        <div class="ProssHead1">请选择要打包的资源和活动</div>
        <div class="tab-content margin-top-15 pcksThree0ResAct">
          <!--资源begin-->
          <div id="nav-profile-ziyuan" class="tab-pane fade show active resources-content" role="tabpanel" aria-labelledby="nav-profile-tab-ziyuan">
            <div style="display: flex;">
              <div style="width: 30%">章节</div>
              <div style="width: 30%; margin-left: 5%;">章节分组</div>
              <div style="width: 30%; margin-left: 5%;">分组活动</div>
            </div>
            <div style="display: flex">
              <div style="width: 30%">
                <!--引入树形组件-->
                <cb-tree
                  :z-nodes="treeData"
                  :setting="treeSetting"
                  :id="'tree'"
                  :parent-vue="{}"
                  :check="true"
                  height= "450px"
                  expand-level="1"
                  id-key="chapterId"
                  p-id-key="parentId"
                  name="chapterName"
                  @onCheck="changeChapterCheck"
                  @onclick="handleGroupList"
                />
              </div>
              <!-- 章节分组 -->
              <div style="width: 30%; margin-left: 5%; border: 1px solid #ced4da; padding: 5px" class="catalogue">
                <div
                  v-for="(item,index) in pkgResGroupList"
                  :key="index"
                  style="text-align: left">
                  <input
                    :value="item.resgroupId"
                    v-model="groupSelected"
                    class="group-selected-checkbox"
                    type="checkbox"
                    @click="handleGroupCheckbox(item)" >
                  <span class="group-name" @click="handleActivityList(item)">{{ item.resgroupName }}</span>
                </div>
              </div>
              <!-- 活动分组中的活动 -->
              <div style="width: 30%; margin-left: 5%; border: 1px solid #ced4da; padding: 5px" class="catalogue">
                <div
                  v-for="(item,index) in activityList"
                  :key="index"
                  style="text-align: left">
                  <input
                    :value="item.activityId"
                    v-model="activitySelected"
                    type="checkbox"
                    @click="handleActivityCheckbox(item)" >
                  <span>{{ item.activityTitle }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="padding-top-30 margin-bottom-15">
          <span class="publishPcks" @click="toPublishPage2('1')">下一步</span>
          <span class="publishPcks" @click="toPublishPageOr">取消</span>
        </div>
      </div>
      <!--选择资源和活动end-->
      <!--排序begin-->
      <div v-show="PcksThree1">
        <div class="ProssHead1">
          请根据课程设计为教学包中的资源、活动调整顺序<br>
          <small>
            你可以对组内资源和活动顺序进行排序，也可对分组的顺序进行排序，如果不需要排序则可直接
            <span class="baseBlue" style="cursor:pointer" @click="toPublishPage2('2')">前往下一步</span>
          </small>
        </div>
        <div style="display: flex;">
          <div style="width: 30%">章节</div>
          <div style="width: 30%; margin-left: 5%;">章节分组</div>
          <div style="width: 30%; margin-left: 5%;">分组活动</div>
        </div>
        <div style="display: flex">
          <div style="width: 30%">
            <cb-tree
              :z-nodes="sortTreeData"
              :id="'sortTree'"
              :setting="treeSetting2"
              :parent-vue="{}"
              :check="false"
              :expand-all="true"
              height="400px"
              id-key="chapterId"
              p-id-key="parentId"
              name="chapterName"
              @onclick="handleGroupList"
            /><!--@onclick="handleGroupList"-->
          </div>
          <div style="width: 30%; margin-left: 5%; border: 1px solid #ced4da; padding: 5px" class="catalogue">
            <div
              v-for="(item,index) in pkgResGroupList"
              :key="index"
              style="text-align: left"
              class="hover-color"
              @click="handleActivityList(item)">
              <span class="group-name">{{ item.resgroupName }}</span>
              <span v-if="index != 0" style="float: right; margin-right: 30px; color: #007bff" @click.stop="moveUpGroup(item.resgroupId)">上移</span>
              <span v-if="index != pkgResGroupList.length - 1" style="float: right; margin-right: 30px; color: #007bff" @click.stop="moveDownGroup(item.resgroupId)">下移</span>
            </div>
          </div>
          <!-- 活动分组中的活动 -->
          <div style="width: 30%; margin-left: 5%; border: 1px solid #ced4da; padding: 5px" class="catalogue">
            <div
              v-for="(item,index) in activityList"
              :key="index"
              style="text-align: left"
              class="hover-color">
              <span>{{ item.activityTitle }}</span>
              <span v-if="index != 0" style="float: right; margin-right: 30px; color: #007bff" @click.stop="moveUpActivity(item.activityId)">上移</span>
              <span v-if="index != activityList.length - 1" style="float: right; margin-right: 30px; color: #007bff" @click.stop="moveDownActivity(item.activityId)">下移</span>
            </div>
          </div>
        </div>
        <div class="padding-top-30 margin-bottom-15">
          <span class="publishPcks" @click="toNextStep('0')">上一步</span>
          <span class="publishPcks" @click="toPublishPage2('2')">下一步</span>
          <span class="publishPcks" @click="toPublishPageOr">取消</span>
        </div>
      </div>
      <!--排序end-->
      <!-- 云盘文件选择begin -->
      <div v-show="PcksThree2">
        <div class="ProssHead1">
          请根据课程设计为教学包中云盘的文件进行挑选<br>
          <!--<small>
                  如果不需要挑选则可直接
                  <span class="baseBlue" @click="toPublishPage2('3')" style="cursor:pointer">前往下一步</span>
                </small>-->
        </div>
        <div style="display: flex;justify-content: center;">
          <div style="width: 30%">云盘</div>
          <!--<div style="width: 30%; margin-left: 5%;">文件</div>-->
        </div>
        <div style="display: flex;justify-content: center;">
          <div style="width: 80%">
            <!--引入树形组件-->
            <cb-tree
              :z-nodes="cloudDiskData"
              :id="'cloudDiskTree'"
              :setting="cloudTreeSetting"
              :parent-vue="{}"
              height= "400px"
              id-key="id"
              p-id-key="parentId"
              @onCheck="changeCloudDiskCheck"
            />
          </div>
          <!--<div style="width: 30%; margin-left: 5%; border: 1px solid #ced4da; padding: 5px">
                  <div
                    style="text-align: left"
                    v-for="(item,index) in cloudDiskFile"
                    :key="index">
                    <input
                      class="group-selected-checkbox"
                      type="checkbox"
                      :value="item.id"
                      @click="handleCloudDiskFile(item)"
                      v-model="selectedCloudDiskFile" />
                    <span class="group-name">{{item.name}}</span>
                  </div>
                </div>-->
        </div>
        <div class="padding-top-30 margin-bottom-15">
          <span class="publishPcks" @click="toNextStep('1')">上一步</span>
          <span class="publishPcks" @click="toPublishPage2('3')">下一步</span>
          <span class="publishPcks" @click="toPublishPageOr">取消</span>
        </div>
      </div>
      <!-- 云盘文件选择end -->
      <!--选择发布方begin-->
      <div v-show="PcksThree3">
        <div class="textAlignLeft PcksThree2Center">
          <div
            v-for="(item,index) in dictListDeployMainType"
            :key="index"
            class="form-check padding-top-40">
            <input :id="'exampleRadios'+index" :value="item.dictCode" v-model="dataFormPckPublic.deploySubType" class="form-check-input" type="radio" name="exampleRadios" checked>
            <label :for="'exampleRadios'+index" class="form-check-label">
              {{ item.dictValue }}<br>
              发布者为{{ item.dictValue }}，将由{{ item.dictValue }}管理授权分享等工作
            </label>
          </div>
        </div>
        <div class="padding-top-30 margin-bottom-15">
          <span class="publishPcks" @click="toNextStep(2)">上一步</span>
          <span class="publishPcks" @click="toPublishPage2('4')">下一步</span>
          <span class="publishPcks" @click="toPublishPageOr">取消</span>
        </div>
      </div>
      <!--选择发布方end-->
      <!--填写基本信息begin-->
      <div v-show="PcksThree4">
        <div class="ProssHead1">请填写教学包相关基本信息</div>
        <form>
          <div class=" row" style="width: 80%;margin: auto">
            <!-- <span class="addLibraryRedXing">*</span>-->
            <div class="col-12 row form-group">
              <label for="pkgId" class="col-form-label col-2 " style="text-align: right">版本号<span class="color-d81e06">*</span></label>
              <el-input id="pkgId" v-model="dataFormPckPublic.pkgId" type="text" class="form-control-sm col-5 " placeholder="版本号填写(形如v1.0.4)" required @input="change($event)"/>
              <div class="invalid-feedback col-10 textAlignLeft p-0 pkgIdHint" style="margin-left:5px;line-height: 30px;"><small >请输入正确的教学包版本号！(形如v1.0.4)</small></div>
              <el-select class="form-control-sm col-5" placeholder="版本号不能与历史版本号重复，点击查看历史版本号">
                <el-option
                  v-for="item in historyPkgList"
                  :key="item.pkgId"
                  :label="item.pkgVersion + ' 发布于' + item.createTime"
                  :value="item.pkgId"
                  :disabled="true"/>
              </el-select>
            </div>
            <div class="col-12 row form-group">
              <label for="pkgName" class="col-form-label col-2 " style="text-align: right">名称<span class="color-d81e06">*</span></label>
              <el-input id="pkgName" v-model="dataFormPckPublic.pkgName" type="text" disabled class="form-control-sm col-10 " placeholder="名称" @input="change($event)"/>
              <div class="invalid-feedback col-10 textAlignLeft p-0 pkgNameHint" style="margin-left:5px;line-height: 30px;"><small >请输入教学包名称！</small></div>
            </div>
            <div class="col-12 row form-group">
              <div class="col-form-label col-2 " style="text-align: right">课程发布方</div>
              <div
                v-for="(item,index) in dictListDeployMainType"
                v-if="item.dictCode === dataFormPckPublic.deploySubType"
                :key="index"
                class="col-10"
                style="text-align: left;margin-top: 7px;" >{{ item.dictValue }}</div>
            </div>
            <div class="col-12 row form-group">
              <div class="col-form-label col-2 " style="text-align: right">使用限制</div>
              <el-select v-model="dataFormPckPublic.pkgLimit" class="form-control-sm col-10">
                <el-option v-for="(item,index) in dictListPkgLimit" :key="index" :value="item.dictCode" :label="item.dictValue" selected/>
                <!--<option value="2">不需要授权就能使用</option>-->
              </el-select>
            </div>
            <div class="col-12 row form-group" style="margin-top: -15px;">
              <div class="col-form-label col-2 "/>
              <div class="col-form-label col-10 " style="text-align: left;font-size: 14px;color: #9c9c9c">选择"授权"其他用户需在得到教学包发布者或机构管理员的授权后才能用</div>
            </div>
            <div class="col-12 row form-group">
              <label for="pkgUserName" class="col-form-label col-2 " style="text-align: right">联系人<span class="color-d81e06">*</span></label>
              <el-input id="pkgUserName" v-model="dataFormPckPublic.pkgUserName" type="text" class="form-control-sm col-10 " placeholder="联系人" @input="change($event)"/>
              <div class="invalid-feedback col-10 textAlignLeft p-0 pkgUserNameHint" style="margin-left:5px;line-height: 30px;"><small >请输入教学包联系人！</small></div>
            </div>
            <div class="col-12 row form-group">
              <label for="pkgPhone" class="col-form-label col-2" style="text-align: right">联系方式<span class="color-d81e06">*</span></label>
              <el-input id="pkgPhone" v-model="dataFormPckPublic.pkgPhone" type="text" class="form-control-sm col-10" placeholder="请填写电话" required @input="change($event)"/>
            </div>
            <div class="col-12 row form-group">
              <label for="pkgQQ" class="col-form-label col-2 " style="text-align: right"/>
              <el-input id="pkgQQ" v-model="dataFormPckPublic.pkgQQ" type="text" class="form-control-sm col-10" placeholder="请填写QQ" required @input="change($event)"/>
            </div>
            <div class="col-12 row form-group">
              <label for="pkgVX" class="col-form-label col-2 " style="text-align: right"/>
              <el-input id="pkgVX" v-model="dataFormPckPublic.pkgVX" type="text" class="form-control-sm col-10 " placeholder="请填写微信" required @input="change($event)"/>
            </div>
            <div class="col-12 row form-group">
              <label for="pkgEmail" class="col-form-label col-2 " style="text-align: right"/>
              <el-input id="pkgEmail" v-model="dataFormPckPublic.pkgEmail" type="text" class="form-control-sm col-10 " placeholder="请填写邮箱" required @input="change($event)"/>
            </div>
            <div class="col-12 row form-group" style="margin-top: -15px;">
              <div class="col-form-label col-2 "/>
              <div class="invalid-feedback col-10 textAlignLeft p-0 pkgContactHint" style="margin-left:5px;"><small >电话、QQ、微信、邮箱中，至少选择一样联系方式进行填写</small></div>
            </div>
            <div class="col-12 row form-group">
              <div class="col-form-label col-2 " style="text-align: right">适用层次</div>
              <div class="col-form-label col-10" style="display: flex;text-align: left">
                <label v-for="(item,index) in dictListPkgLevel" :key="index" class="radio-inline" style="width: 10%">
                  <input :id="'inlineRadio'+index" :value="item.dictCode" v-model="dataFormPckPublic.pkgLevel" type="radio" name="inlineRadioOptions"> {{ item.dictValue }}
                </label>
              </div>
            </div>
            <div class="col-12 row form-group">
              <label for="pkgKeyword" class="col-form-label col-2 " style="text-align: right">关键字</label>
              <el-input id="pkgKeyword" v-model="dataFormPckPublic.pkgKeyword" type="text" class="form-control-sm col-10 " placeholder="输入关键字" required @input="change($event)"/>
            </div>
            <div class="col-12 row form-group" style="margin-top: -15px;">
              <div class="col-form-label col-2 "/>
              <div class="col-form-label col-10" style="text-align: left;font-size: 14px;color: #9c9c9c">输入相关的关键字越多越方便其他用户查找这个教学包，多个关键字可用分号分隔</div>
            </div>
            <div class="col-12 row form-group">
              <div class="col-form-label col-2 " style="text-align: right">描述</div>
              <el-input v-model="dataFormPckPublic.pkgDesc" :rows="4" type="textarea" class="form-control-sm col-10" style="height: 100px" placeholder="输入描述" @input="change($event)"/>
            </div>
            <div class="col-12 row form-group">
              <div class="col-form-label col-2 " style="text-align: right">教学包封面<!--<span class="color-d81e06">*</span>--></div>
              <label class="col-form-label" style="text-align: left;margin-left:5px;">
                <input id="classroomPic" type="file" name="ClassImg" accept="image/gif,image/jpeg,image/jpg,image/png" style="display: none" @change="changeImage($event)">
                <img :src="pic" class="img-avatar" width="130px" height="100px" style="cursor: pointer">
              </label>
            </div>
            <div class="invalid-feedback col-10 textAlignLeft p-0 pkgPic" style="margin-left:5px;"><small >请上传教学包封面</small></div>
          </div>
        </form>
        <div class="padding-top-30 margin-bottom-15">
          <span class="publishPcks" @click="toNextStep(3)">上一步</span>
          <span class="publishPcks" @click="toPublishPage2('5')">下一步</span>
          <span class="publishPcks" @click="toPublishPageOr">取消</span>
        </div>
      </div>
      <!--填写基本信息end-->
      <!--提交审核begin-->
      <div v-show="PcksThree5">
        <div class="ProssHead1">{{ auditInfo.pkgName }}{{ auditInfo.pkgVersion }}（{{ auditInfo.createTime }}）</div>
        <div class="ProssHead1">{{ auditInfo.checkStateName }}</div>
        <div class="ProssHead1">{{ auditInfo.checkState === 'N' ? ('原因：' + auditInfo.reason) :'教学包已提交至管理员审核，审核大约需要1-2个工作日' }}</div>
        <div class="padding-top-30 margin-bottom-15">
          <span v-if="auditInfo.checkState === 'W'" class="publishPcks" @click="toMyTeachingPackage">前往教学包管理</span>
          <span v-else class="publishPcks" @click="confirmAudit(auditInfo.pkgId)">确认审核</span>
        </div>
      </div>
      <!--提交审核end-->
    </div>
    <!--发布流程end-->
  </div>
</template>

<script>
import $ from '@/assets/jquery-vendor'
import CbEditor from '@/components/cb-editor'
import CbTree from '@/components/cb-tree'
import { baseUrl, toast, alert, loadingModal, formVaildStyle, formInVaildStyle } from '@/utils/global'
export default {
  components: {
    CbTree,
    'cb-editor': CbEditor
  },
  props: {
    pkgId: {
      type: String,
      required: true,
      default: ''
    },
    subjectId: {
      type: String,
      required: true,
      default: ''
    },
    pkgInfo: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      historyPkgList: [],
      // 审核信息
      auditInfo: {},
      cloudTreeSetting: {
        check: {
          enable: true
        },
        data: {
          key: {
            name: 'name'
          },
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'parentId',
            rootPId: 0
          }
        },
        callback: {
          onCheck: this.changeCloudDiskCheck
        },
        // 字体样式大小配置
        view: {
          // fontCss: this.getFont || {'color':'red'},
          // nameIsHTML: true
        }
      },
      treeSetting: {
        check: {
          enable: true
        },
        data: {
          key: {
            name: 'chapterName'
          },
          simpleData: {
            enable: true,
            idKey: 'chapterId',
            pIdKey: 'parentId'
          }
        },
        callback: {
          // beforeClick: null,
          onClick: this.handleGroupList,
          onCheck: this.changeChapterCheck
        },
        // 字体样式大小配置
        view: {
          // fontCss: this.getFont || {'color':'red'},
          // nameIsHTML: true
        }
      },
      treeSetting2: {
        check: {
          enable: false
        },
        data: {
          key: {
            name: 'chapterName'
          },
          simpleData: {
            enable: true,
            idKey: 'chapterId',
            pIdKey: 'parentId'
          }
        },
        callback: {
          onClick: this.handleGroupList
        }
      },
      treeData: [],
      pic: 'static/image/uploadImg.png',
      showPcks: true, // 发布教学包
      PcksThree5: false,
      PcksThree4: false,
      PcksThree3: false,
      PcksThree2: false,
      PcksThree1: false,
      PcksThree0: true,
      dataFormContent: { // 教材章节具体内容表单数据
        chapterContent: null
      },
      dictListDeployMainType: [], // 所有发布方
      dictListPkgLimit: [], // 所有教学包的使用权限
      dictListPkgLevel: [], // 所有教学包的适用层次
      selectedIdArray: [],
      dataFormPckPublic: {
        pkgId: 'v1.0.0',
        deploySubType: '2',
        pkgLimit: '1',
        pkgLevel: '1',
        pkgName: null,
        nickName: null
      },
      techingThreePublishName: ['选择资源和活动', '排序', '选择云盘文件', '选择发布方', '填写基本信息', '提交审核'],
      colums: ['序号', '标题', '分组', '上传时间', '视频时长'],
      columsActity: ['序号', '类型', '标题', '分组', '上传时间', '题目数量'],

      chapterSelected: [], // 选中的章节集合
      chapterChangeList: [], // 点击章节复选框造成选中或取消的章节集合
      chapterIdSelected: '', // 当前选中查看分组的章节id
      allChapterParentId: [], // 所有章节的id与父级id

      pkgResGroupList: [], // 章节分组集合
      groupSelectedAllList: [], // 所有选中的分组
      clickChapterGroupList: [], // 当前选择/取消章节中的分组
      groupSelected: [], // 选中的分组集合
      groupIdSelected: '', // 当前选中查看活动的分组id

      activityList: [], // 活动集合
      activitySelectedAllList: [], // 所有选中的活动
      clickGroupActivityList: [], // 当前选择/取消章节中的活动
      activitySelected: [], // 选中的活动集合
      activityAllList: [], // 处理后的选中活动

      classroomActivityListSelected: [], // 选中的课程节点活动集合
      isShowClassroomActivity: false, // 是否显示课程节点活动

      sortTreeData: [], // 选中排序的章节
      list: [], // 提交的教材数据

      cloudDiskData: [], // 云盘目录数据
      selectedCloudDiskFile: [], // 选中的云盘文件

      stopClick: true,
      chapterList: [], // 临时选中存放章节数据

      chapterDataList: [] // 所有章节分组和活动信息
    }
  },
  mounted() {
  },
  created() {
  },
  methods: {
    getHistoryPkgList() {
      this.$api.pkgInfo.getHistoryPkgList({ pkgId: this.pkgId }).then(res => {
        this.historyPkgList = res.data
      })
    },
    // 解决el-input内容不能输入和删除问题
    change(e) {
      this.$forceUpdate()
    },
    // 上一步、下一步
    toPublishPage2: function(index) {
      // 如果跳转页面是章节选择
      if (index === '0') {
        // 初始化数据
        this.dataInit()
        this.toNextStep(0)
      }
      // 如果跳转页面是排序
      if (index === '1') {
        // 判断是否选中章节
        if (this.chapterSelected.length <= 0) {
          alert('当前未选择资源，不可进行下一步！')
          return false
        }
        // 清空当前分组与活动的显示数据
        this.pkgResGroupList = []
        this.activityList = []
        // 获取所有章节自己的父级章节
        this.manageChapterSelected()
        // 去重
        this.chapterSelected = this.unique(this.chapterSelected)
        // 获取选中的所有章节的树状图数据
        // $.fn.zTree.getZTreeObj("sortTree").refresh();
        this.getSortData()
        this.toNextStep(1)
        /* 根据 treeId 获取 zTree 对象*/
        // var zTree = $.fn.zTree.getZTreeObj("sortTree");
        // 刷新
        // zTree.refresh();
        // zTree.reAsyncChildNodes(null, "refresh",false);
        // $.fn.zTree.init($('#sortTree'), this.treeSetting2, this.sortTreeData)
      }
      // 如果跳转页面是选择云盘文件
      if (index == '2') {
        // 获取云盘目录数据
        this.getCloudDiskData()
        this.toNextStep(2)
      }
      // 如果跳转页面是发布方选中
      if (index == '3') {
        // 处理教材包数据提交格式
        this.manageTeachingMaterialData()
        // 获取发布方数据
        this.showDeployMainTypeListData()
        this.toNextStep(3)
      }
      // 如果跳转页面是教材包基本信息填写
      if (index == '4') {
        // 获取教学包使用权限数据
        this.showPkgLimitListData()
        // 获取教学包适用层次数据
        this.showPkgLevelListData()
        this.getHistoryPkgList()
        // 存入当前教学包的基本信息，方便发布人填写
        if (this.pkgInfo) {
          // 教学包名称
          this.dataFormPckPublic.pkgName = this.pkgInfo.pkgName
          // 关键词
          this.dataFormPckPublic.pkgKeyword = this.pkgInfo.pkgKey
          // 备注
          this.dataFormPckPublic.pkgDesc = this.pkgInfo.pkgDesc
          // 版本号
          this.dataFormPckPublic.pkgId = this.pkgInfo.pkgVersion
          // 用户名
          this.dataFormPckPublic.pkgUserName = this.pkgInfo.pkgTraineeName
          // QQ号
          this.dataFormPckPublic.pkgQQ = this.pkgInfo.pkgTraineeQq
          // 手机号
          this.dataFormPckPublic.pkgPhone = this.pkgInfo.pkgTraineeMobile
          // 微信
          this.dataFormPckPublic.pkgVX = this.pkgInfo.pkgTraineeWx
          // 邮箱
          this.dataFormPckPublic.pkgEmail = this.pkgInfo.pkgTraineeEmail
          // 头像
          if (this.pkgInfo.prePkgLogo) {
            this.dataFormPckPublic.pic = this.pkgInfo.prePkgLogo.slice(this.pkgInfo.prePkgLogo.lastIndexOf('/') + 1)
            this.pic = baseUrl + this.pkgInfo.prePkgLogo
          }
        }
        this.toNextStep(4)
      }
      // 如果跳转页面是已提交教材包
      if (index == '5') {
        if (this.formVerifyBoolean()) { // 验证教材包基本信息填写页面信息
          if (!this.stopClick) {
            return false
          }
          loadingModal(true, '正在生成教学包数据，请稍后...')
          // 处理课程节点活动数据（未分组活动）
          const noGroupActivityList = []
          for (let i = 0; i < this.classroomActivityListSelected.length; i++) {
            const obj = {
              activityId: this.classroomActivityListSelected[i].activityId,
              activityType: this.classroomActivityListSelected[i].activityType
            }
            noGroupActivityList.push(obj)
          }
          // 获取发布教学包的提交格式
          const formData = {
            'pkgId': this.pkgId,
            'subjectId': this.subjectId,
            'list': this.list,
            'cloudPanList': this.selectedCloudDiskFile,
            'activityList': noGroupActivityList,
            'pkgName': this.dataFormPckPublic.pkgName,
            'pkgKey': this.dataFormPckPublic.pkgKeyword,
            'pkgDesc': this.dataFormPckPublic.pkgDesc,
            'pkgRemark': this.dataFormContent.resContent,
            'pkgLevel': this.dataFormPckPublic.pkgLevel,
            'pkgLimit': this.dataFormPckPublic.pkgLimit,
            'deployMainType': this.dataFormPckPublic.deploySubType,
            'deploySubType': '',
            'pkgVersion': this.dataFormPckPublic.pkgId,
            'versionRemark': '没有',
            'pkgLogo': this.dataFormPckPublic.pic,
            'pkgTraineeName': this.dataFormPckPublic.pkgUserName,
            'pkgTraineeQq': this.dataFormPckPublic.pkgQQ,
            'pkgTraineeMobile': this.dataFormPckPublic.pkgPhone,
            'pkgTraineeWx': this.dataFormPckPublic.pkgVX,
            'pkgTraineeEmail': this.dataFormPckPublic.pkgEmail
          }
          // 调用发布教学包的提交接口
          this.stopClick = false
          this.$api.pkgInfo.releaseTeachingPackage(formData).then(res => {
            if (res.code == 200) {
              loadingModal(false)
              toast(res.msg)
              this.toPublishPageOr()
            } else if (res.code == 0) {
              // 初始化教学包基本信息填写页面数据
              this.dataFormPckPublic = {
                deploySubType: '2',
                pkgLimit: '1',
                pkgLevel: '1',
                pkgName: null,
                nickName: null
              }
              this.pic = 'static/image/uploadImg.png'
              loadingModal(false)
              toast(res.msg)
              this.toPublishPage()
            } else {
              loadingModal(false)
              toast(res.msg)
              this.stopClick = true
              return false
            }
          }).catch(error => {
            loadingModal(false)
            toast('响应超时')
            this.$router.push('/')
          })
        } else {
          return
        }
      }
    },

    // 下一步及修改进度样式
    toNextStep(index) {
      const indexs = parseInt(index)
      // 前面的当前颜色变化
      $('.progressSelectingDiv').removeClass('progressSelectingDiv')
      $('.progressSelectingSJX').removeClass('progressSelectingSJX')
      $('.progressSelectingSJX2').removeClass('progressSelectingSJX2')
      $('div[kid=' + indexs + ']').children('.progressAllDiv').addClass('progressSelectingDiv')
      $('div[kid=' + indexs + ']').children('.progress1-sjx').addClass('progressSelectingSJX')
      $('div[kid=' + indexs + ']').children('.progress1-sjx2').addClass('progressSelectingSJX2')
      // 已经填过的模块颜色变化
      $('.progressSelectedDiv').removeClass('progressSelectedDiv')
      $('.progressSelectedSJX').removeClass('progressSelectedSJX')
      $('.progressSelectedSJX2').removeClass('progressSelectedSJX2')
      // 显示对应的模块
      for (let i = 0; i < indexs; i++) {
        this['PcksThree' + i] = false
        $('div[kid=' + i + ']').children('.progressAllDiv').addClass('progressSelectedDiv')
        $('div[kid=' + i + ']').children('.progress1-sjx').addClass('progressSelectedSJX')
        $('div[kid=' + i + ']').children('.progress1-sjx2').addClass('progressSelectedSJX2')
      }
      for (let k = indexs + 1; k < 6; k++) {
        this['PcksThree' + k] = false
      }
      this['PcksThree' + indexs] = true
    },

    // 数据初始化
    dataInit() {
      this.chapterSelected = [] // 选中的章节集合
      this.chapterChangeList = [] // 点击章节复选框造成选中或取消的章节集合
      this.chapterIdSelected = '' // 当前选中查看分组的章节id
      this.allChapterParentId = [] // 所有章节的id与章节父级的id

      this.pkgResGroupList = [] // 章节分组集合
      this.groupSelectedAllList = [] // 所有选中的分组
      this.clickChapterGroupList = [] // 当前选择/取消章节中的分组
      this.groupSelected = [] // 选中的分组集合
      this.groupIdSelected = '' // 当前选中查看活动的分组id

      this.activityList = [] // 活动集合
      this.activitySelectedAllList = [] // 所有选中的分组
      this.clickGroupActivityList = [] // 当前选择/取消章节中的分组
      this.activitySelected = [] // 选中的活动集合

      this.classroomActivityListSelected = [] // 选中的课程节点活动集合
      this.isShowClassroomActivity = false // 是否显示课程节点活动

      // 获取当前需要发布的教材包
      const obj = {
        pkgId: this.pkgId,
        subjectId: this.subjectId
      }
      // 调用章节的树形图数据获取接口
      // this.$api.pkgInfo.getBookTreeData(obj).then((res) => {
      //     if (res.code == 0) {

      //     }
      // });
      // 获取所有章节分组和活动信息
      const formData = new FormData()
      formData.append('pkgId', this.pkgId)
      this.$api.pkgInfo.queryDataList(formData).then((res) => {
        if (res.code == 0) {
          res.data.resgroupList = []
          this.chapterDataList = []
          this.getChapterList(res.data)

          // 清空原有数据并存入新的教材包数据
          this.treeData = []
          this.treeData.push(res.data)
          // 获取所有章节的id与章节父级的id
          this.getAllChapterParentId(this.treeData[0], null)
          // 当前流程样式改变
          $('div[kid=' + 0 + ']').children('.progressAllDiv').addClass('progressSelectingDiv')
          $('div[kid=' + 0 + ']').children('.progress1-sjx').addClass('progressSelectingSJX')
          $('div[kid=' + 0 + ']').children('.progress1-sjx2').addClass('progressSelectingSJX2')
        }
      })
    },

    // 递归获取所有章节对象
    getChapterList(chapter) {
      // 活动绑定章节id
      chapter.activityList.forEach(item => {
        item.chapterId = chapter.chapterId
      })
      this.chapterDataList.push(chapter)
      if (chapter.children != null) {
        for (let i = 0; i < chapter.children.length; i++) {
          this.getChapterList(chapter.children[i])
        }
      }
    },
    // 获取审核信息
    // getAuditInfo(){
    //     let formData = new FormData();
    //     formData.append("pkgId",this.pkgId);
    //     this.$api.pkgInfo.querMyWaitCheckPkgList(formData).then(res => {
    //         if (res.code === 0) {
    //             this.auditInfo = res.data;
    //         }else{
    //             toast(res.msg);
    //         }
    //     })
    // },
    // 马上发布教学包
    toPublishPage: function() {
      // 判断当前教学包是否有版本在审核
      const formData = new FormData()
      formData.append('pkgId', this.pkgId)
      this.$api.pkgInfo.check(formData).then(res => {
        if (res.code === 0) {
          if (!res.data.hasCheckingPkg) {
            // 清空数据并打开发布教学包页面
            this.dataInit()
            this.showPcks = false
          } else {
            this.showPcks = false
            res.data.tevglPkgInfo.checkStateName = res.data.checkStateName
            res.data.tevglPkgInfo.checkState = res.data.checkState
            this.auditInfo = res.data.tevglPkgInfo
            this.toNextStep(5)
          }
        } else {
          toast(res.msg)
        }
      })

      // this.$router.push('/TeachingPcksPublic')
    },
    // 取消
    toPublishPageOr: function() {
      // 返回发布教学包首页
      //   this.toPublishPage2('0');
      this.showPcks = true
      this.PcksThree1 = false
      this.PcksThree2 = false
      this.PcksThree3 = false
      this.PcksThree4 = false
      this.PcksThree5 = false
      this.PcksThree0 = true
      this.treeData = []
      this.selectedCloudDiskFile = []
    },
    // 跳转到教学包管理页面
    toMyTeachingPackage() {
      this.$router.push({
        path: `/my-teaching-package`
      })
    },
    // 确认审核
    confirmAudit(value) {
      const formData = new FormData()
      formData.append('pkgId', value)
      this.$api.pkgInfo.deletePkg(formData).then(res => {
        if (res.code === 0) {
          this.toPublishPageOr()
        }
      })
    },
    // 处理当前选中的图片
    changeImage(e) {
      var file = e.target.files[0]
      const formData = new FormData()
      formData.append('file', file)
      this.$api.pkgInfo.uploads(formData).then((res) => {
        that.dataFormPckPublic.pic = res.data.imgNamePc
      })
      var reader = new FileReader()
      var that = this
      reader.readAsDataURL(file)
      reader.onload = function(e) {
        that.pic = this.result
      }
    },

    // 获得当前章节的所有分组
    handleGroupList(data, treeId, treeNode) {
      // 清空当前显示的分组与活动数据
      this.pkgResGroupList = []
      this.activityList = []
      // 存入当前点击的章节id
      this.chapterIdSelected = treeNode.chapterId
      // 创建一个获取当前章节分组接口的传参对象
      // let obj = {
      //     id: treeNode.id,
      //     pkgId: this.pkgId
      // };
      // 如果点击的是课程节点
      if (treeNode.type === 'subject') {
        this.isShowClassroomActivity = true
        const formData = new FormData()
        formData.append('pkgId', this.pkgId)
        this.$api.activity.queryActivityList(formData).then((res) => {
          // 清空当前显示的活动数据
          this.activityList = []
          this.activitySelected = []
          // 存入当前显示活动的数据
          this.activityList = res.data
          // 课程节点活动已选的默认选中
          for (let i = 0; i < this.classroomActivityListSelected.length; i++) {
            for (let j = 0; j < this.activityList.length; j++) {
              if (this.activityList[j].activityId === this.classroomActivityListSelected[i].activityId) {
                this.activitySelected.push(this.activityList[j].activityId)
              }
            }
          }
          // 排序时显示已选中活动
          if (this.PcksThree1) {
            const temp = []
            for (let i = 0; i < this.classroomActivityListSelected.length; i++) {
              for (let j = 0; j < this.activityList.length; j++) {
                if (this.activityList[j].activityId === this.classroomActivityListSelected[i].activityId) {
                  temp.push(this.activityList[j])
                }
              }
            }
            this.activityList = temp
          }
        })
      } else {
        // console.log(treeNode);
        this.isShowClassroomActivity = false
        this.chapterDataList.forEach(obj => {
          if (treeNode.chapterId === obj.chapterId) {
            // 如果当前章节已选中，他的分组已选的也默认选中，否则全不选
            if (this.chapterSelected.indexOf(this.chapterIdSelected) !== -1) {
              for (let i = 0; i < this.groupSelectedAllList.length; i++) {
                for (let j = 0; j < obj.resgroupList.length; j++) {
                  if (obj.resgroupList[j].resgroupId === this.groupSelectedAllList[i]) {
                    this.groupSelected.push(obj.resgroupList[j].resgroupId)
                  }
                }
              }
            } else {
              this.groupSelected = []
            }
            obj.resgroupList.forEach(item => {
              if (item.dictCode === '2') {
                this.handleActivityList(item)
              }
            })
            // 如果当前是排序中，只显示已选中分组，否则全显示
            if (this.PcksThree1) {
              for (let i = 0; i < this.groupSelectedAllList.length; i++) {
                for (let j = 0; j < obj.resgroupList.length; j++) {
                  if (obj.resgroupList[j].resgroupId === this.groupSelectedAllList[i]) {
                    this.pkgResGroupList.push(obj.resgroupList[j])
                  }
                }
              }
            } else {
              this.pkgResGroupList = obj.resgroupList
            }
          }
        })
        // 调用获取当前章节分组的接口
        // this.$api.library.findDataDetailsContent(obj).then((res) => {
        //     if (res.code == 0){
        //         //如果当前章节已选中，他的分组已选的也默认选中，否则全不选
        //         if(this.chapterSelected.indexOf(this.chapterIdSelected) !== -1){
        //             for (let i = 0; i < this.groupSelectedAllList.length; i++) {
        //                 for (let j = 0; j < res.data.pkgResGroupList.length; j++) {
        //                     if (res.data.pkgResGroupList[j].resgroupId === this.groupSelectedAllList[i]){
        //                         this.groupSelected.push(res.data.pkgResGroupList[j].resgroupId);
        //                     }
        //                 }
        //             }
        //         }else {
        //           this.groupSelected = [];
        //         }
        //         res.data.pkgResGroupList.forEach(item => {
        //             if (item.dictCode === '2') {
        //                 this.handleActivityList(item);
        //             }
        //         })
        //         //如果当前是排序中，只显示已选中分组，否则全显示
        //         if(this.PcksThree1){
        //             for (let i = 0; i < this.groupSelectedAllList.length; i++) {
        //                 for (let j = 0; j < res.data.pkgResGroupList.length; j++) {
        //                     if (res.data.pkgResGroupList[j].resgroupId === this.groupSelectedAllList[i]){
        //                         this.pkgResGroupList.push(res.data.pkgResGroupList[j]);
        //                     }
        //                 }
        //             }
        //         }else {
        //             this.pkgResGroupList = res.data.pkgResGroupList;
        //         }
        //     }
        // })
      }
    },

    // 获得当前活动分组中所有的活动
    handleActivityList(item) {
      // 清空当前显示的活动数据
      this.activityList = []
      this.activitySelected = []
      // 如果该分组为活动分组那么就显示出所有的活动
      if (item.dictCode === '2') {
        // 存入当前点击分组的id
        this.groupIdSelected = item.resgroupId
        // 创建一个获取章节活动的传参对象
        const obj = {
          pkgId: this.pkgId,
          chapterId: item.chapterId
        }
        // 调用获取当前章节活动的接口
        this.$api.activity.listActivity(obj).then(res => {
          this.activityList = []
          this.activitySelected = []
          if (res.code == 0) {
            // 存入当前显示活动的数据
            for (let i = 0; i < res.data.length; i++) {
              for (let j = 0; j < res.data[i].children.length; j++) {
                this.activityList.push(res.data[i].children[j])
              }
            }
            // 判断当前活动的分组是否是选中状态，如果是就默认选中已选的活动，否则全不选
            if (this.groupSelected.indexOf(this.groupIdSelected) != -1) {
              for (let i = 0; i < this.activitySelectedAllList.length; i++) {
                for (let j = 0; j < this.activityList.length; j++) {
                  if (this.activityList[j].activityId === this.activitySelectedAllList[i].activityId) {
                    this.activitySelected.push(this.activityList[j].activityId)
                  }
                }
              }
            } else {
              this.activitySelected = []
            }
            // 排序时显示已选中活动
            if (this.PcksThree1) {
              const temp = []
              for (let i = 0; i < this.activitySelectedAllList.length; i++) {
                for (let j = 0; j < this.activityList.length; j++) {
                  if (this.activityList[j].activityId === this.activitySelectedAllList[i].activityId) {
                    temp.push(this.activityList[j])
                  }
                }
              }
              this.activityList = temp
            }
          }
        })
      }
    },

    // 获取选中的云盘文件
    changeCloudDiskCheck(e, treeId, treeNode, zTree) {
      this.selectedCloudDiskFile = []
      // 获取所有选中的集合
      const temp = $.fn.zTree.getZTreeObj('cloudDiskTree').getCheckedNodes(true)
      for (let i = 0; i < temp.length; i++) {
        this.selectedCloudDiskFile.push(temp[i].id)
      }
    },

    // 获取点击的云盘目录中的文件
    getCloudDiskFile(data) {
      this.cloudDiskFile = []
      const formData = new FormData()
      formData.append('dirId', data.id)
      formData.append('pkgId', this.pkgId)
      // 调用查看文件夹内容的接口
      this.$api.cloudDisk.viewDetail(formData).then(res => {
        if (res.code === 0) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].type != '1') {
              this.cloudDiskFile.push(res.data[i])
            }
          }
        } else {
          toast(res.msg)
        }
      })
    },

    // 云盘中的文件复选框的单击操作
    handleCloudDiskFile() {

    },

    // 获得选中的章节
    changeChapterCheck(e, treeId, treeNode, zTree) {
      // 清空相关数据
      this.chapterChangeList = []
      this.clickChapterGroupList = []
      this.clickGroupActivityList = []
      // 获取所有 选中/取消 的章节
      this.getChapterIdList(treeNode)
      // 所有选中章节的增加与删除
      if (treeNode.checked) { // 如果当前是选中，那么将选中的值添加到所有章节选中集合中
        let isExist = false
        for (let i = 0; i < this.chapterChangeList.length; i++) {
          for (let j = 0; j < this.chapterSelected.length; j++) {
            if (this.chapterChangeList[i] === this.chapterSelected[j]) {
              isExist = true
            }
          }
          if (!isExist) {
            this.chapterSelected.push(this.chapterChangeList[i])
          }
          isExist = false
        }
      } else { // 如果当前是取消，那么将取消的值从所有章节选中集合中删除
        const temp = []
        const tempArray = []
        for (let i = 0; i < this.chapterChangeList.length; i++) {
          temp[this.chapterChangeList[i]] = typeof this.chapterChangeList[i]
        }
        for (let i = 0; i < this.chapterSelected.length; i++) {
          const type = typeof this.chapterSelected[i]
          if (!temp[this.chapterSelected[i]]) {
            tempArray.push(this.chapterSelected[i])
          } else if (temp[this.chapterSelected[i]].indexOf(type) < 0) {
            tempArray.push(this.chapterSelected[i])
          }
        }
        this.chapterSelected = tempArray
      }

      // 判断当前复选框变化是否存在课程节点的复选框，如果存在并对课程中未分组活动的选中进行全选和取消
      for (let i = 0; i < this.chapterChangeList.length; i++) {
        if (this.chapterChangeList[i] === this.treeData[0].chapterId) {
          const formData = new FormData()
          formData.append('pkgId', this.pkgId)
          this.$api.activity.queryActivityList(formData).then((res) => {
            // 课程节点中活动的增加与删除
            if (treeNode.checked) { // 如果当前是选中，那么将选中的值添加到课程节点活动选中集合中
              let isExist = false
              for (let i = 0; i < res.data.length; i++) {
                for (let j = 0; j < this.classroomActivityListSelected.length; j++) {
                  if (res.data[i].activityId === this.classroomActivityListSelected[j].activityId) {
                    isExist = true
                  }
                }
                if (!isExist) {
                  this.classroomActivityListSelected.push(res.data[i])
                }
                isExist = false
              }
            } else { // 如果当前是取消，那么将取消的值从课程节点活动选中集合中删除
              const tempclassroomActivityListSelected = this.classroomActivityListSelected
              const temp = res.data
              const arr3 = tempclassroomActivityListSelected.filter(item => {
                return temp.every(item2 => {
                  return item.activityId != item2.activityId
                })
              })
              this.classroomActivityListSelected = arr3
            }
          })
        }
      }
      // 获取所有 选中/取消 的章节的分组
      for (let i = 0; i < this.chapterChangeList.length; i++) {
        this.chapterDataList.forEach(item => {
          if (this.chapterChangeList[i] === item.chapterId) {
            // 将查询出来的分组存入需要操作的分组集合中
            for (let j = 0; j < item.resgroupList.length; j++) {
              this.clickChapterGroupList.push(item.resgroupList[j].resgroupId)
            }
            // 所有选中章节中分组的增加与删除
            if (treeNode.checked) { // 如果当前是选中，那么将选中的值添加到所有分组选中集合中
              // 存入临时章节信息，用于后面数据处理
              const temp = {
                chapterId: item.chapterId,
                data: item
              }
              this.chapterList.push(temp)

              let isExist = false
              for (let i = 0; i < this.clickChapterGroupList.length; i++) {
                for (let j = 0; j < this.groupSelectedAllList.length; j++) {
                  if (this.clickChapterGroupList[i] === this.groupSelectedAllList[j]) {
                    isExist = true
                  }
                }
                if (!isExist) {
                  this.groupSelectedAllList.push(this.clickChapterGroupList[i])
                }
                isExist = false
              }
            } else { // 如果当前是取消，那么将取消的值从所有分组选中集合中删除
              // 将取消的章节从临时章节信息中删除
              this.chapterList.forEach((item, index) => {
                if (item.chapterId === item.chapterId) {
                  this.chapterList.splice(index, 1)
                  return
                }
              })

              const temp = []
              const tempArray = []
              for (let i = 0; i < this.clickChapterGroupList.length; i++) {
                temp[this.clickChapterGroupList[i]] = typeof this.clickChapterGroupList[i]
              }
              for (let i = 0; i < this.groupSelectedAllList.length; i++) {
                const type = typeof this.groupSelectedAllList[i]
                if (!temp[this.groupSelectedAllList[i]]) {
                  tempArray.push(this.groupSelectedAllList[i])
                } else if (temp[this.groupSelectedAllList[i]].indexOf(type) < 0) {
                  tempArray.push(this.groupSelectedAllList[i])
                }
              }
              this.groupSelectedAllList = tempArray
            }
          }
        })
        // 创建一个用于分组查询的传参对象
        // let obj = {
        //     pkgId: this.pkgId,
        //     id: this.chapterChangeList[i]
        // };
        // //调用分组查询接口
        // this.$api.library.findDataDetailsContent(obj).then((res) => {
        //     if (res.code == 0){

        //     }
        // })
      }

      // 所有选中章节中活动的增加与删除
      for (let i = 0; i < this.chapterChangeList.length; i++) {
        this.chapterDataList.forEach(obj => {
          if (this.chapterChangeList[i] === obj.chapterId) {
            // 将查询出来的活动存入到操作活动集合中
            for (let i = 0; i < obj.activityList.length; i++) {
              this.clickGroupActivityList.push(obj.activityList[i])
            }
            // 所有选中分组中活动的增加与删除
            if (treeNode.checked) { // 如果当前是选中，那么将选中的值添加到所有活动选中集合中
              let isExist = false
              for (let i = 0; i < this.clickGroupActivityList.length; i++) {
                for (let j = 0; j < this.activitySelectedAllList.length; j++) {
                  if (this.clickGroupActivityList[i].activityId === this.activitySelectedAllList[j].activityId) {
                    isExist = true
                  }
                }
                if (!isExist) {
                  this.activitySelectedAllList.push(this.clickGroupActivityList[i])
                }
                isExist = false
              }
            } else { // 如果当前是取消，那么将取消的值从所有活动选中集合中删除
              const tempActivitySelectedAllList = this.activitySelectedAllList
              const tempClickGroupActivityList = this.clickGroupActivityList
              const arr3 = tempActivitySelectedAllList.filter(item => {
                return tempClickGroupActivityList.every(item2 => {
                  return item.activityId != item2.activityId
                })
              })
              this.activitySelectedAllList = arr3
            }
          }
        })
        // let obj = {
        //     pkgId: this.pkgId,
        //     chapterId: this.chapterChangeList[i],
        // };
        // //调用章节活动信息查询接口
        // this.$api.activity.listActivity(obj).then(res=>{
        //     if (res.code == 0){
        //         //将查询出来的活动存入到操作活动集合中
        //         for (let i = 0; i < res.data.length; i++) {
        //             for (let j = 0; j < res.data[i].children.length; j++) {
        //                 this.clickGroupActivityList.push(res.data[i].children[j]);
        //             }
        //         }
        //         //所有选中分组中活动的增加与删除
        //         if(treeNode.checked){     //如果当前是选中，那么将选中的值添加到所有活动选中集合中
        //             let isExist = false;
        //             for (let i = 0; i < this.clickGroupActivityList.length; i++) {
        //                 for (let j = 0; j < this.activitySelectedAllList.length; j++) {
        //                     if(this.clickGroupActivityList[i].activityId === this.activitySelectedAllList[j].activityId){
        //                         isExist = true;
        //                     }
        //                 }
        //                 if (!isExist){
        //                     this.activitySelectedAllList.push(this.clickGroupActivityList[i]);
        //                 }
        //                 isExist = false;
        //             }
        //         }else {     //如果当前是取消，那么将取消的值从所有活动选中集合中删除
        //             let tempActivitySelectedAllList = this.activitySelectedAllList;
        //             let tempClickGroupActivityList = this.clickGroupActivityList;
        //             let arr3 = tempActivitySelectedAllList.filter(item=>{
        //                 return tempClickGroupActivityList.every(item2=>{
        //                     return item.activityId != item2.activityId;
        //                 })
        //             })
        //             this.activitySelectedAllList = arr3;
        //         }
        //     }
        // })
      }
      // 如果当前章节已选中，他的分组已选中的也默认选中,分组中活动已选择的也默认选中
      if (this.chapterIdSelected) {
        if (this.chapterChangeList.indexOf(this.chapterIdSelected) !== -1) {
          if (treeNode.checked) {
            for (let i = 0; i < this.pkgResGroupList.length; i++) {
              this.groupSelected.push(this.pkgResGroupList[i].resgroupId)
            }
            for (let i = 0; i < this.activityList.length; i++) {
              this.activitySelected.push(this.activityList[i].activityId)
            }
          } else {
            this.groupSelected = []
            this.activitySelected = []
          }
        }
      }
    },

    // 获取 选中/取消 章节中所有的chapterId
    getChapterIdList(chapter) {
      this.chapterChangeList.push(chapter.chapterId)
      if (chapter.children != null) {
        for (let i = 0; i < chapter.children.length; i++) {
          this.getChapterIdList(chapter.children[i])
        }
      }
    },

    // 当前查看分组复选框单击操作
    handleGroupCheckbox(value) {
      const resgroupId = value.resgroupId
      // 活动的全选与取消
      if (value.dictCode === '2') {
        if (this.groupSelected.indexOf(resgroupId) == -1) {
          this.activitySelected = []
          for (let i = 0; i < this.activityList.length; i++) {
            this.activitySelected.push(this.activityList[i].activityId)
          }
        } else {
          this.activitySelected = []
        }
      }
      // 分组的增加与删除
      if (this.groupSelectedAllList.indexOf(resgroupId) == -1) {
        this.groupSelectedAllList.push(resgroupId)
      } else {
        for (let i = 0; i < this.groupSelectedAllList.length; i++) {
          if (resgroupId === this.groupSelectedAllList[i]) {
            this.groupSelectedAllList.splice(i, 1)
            i--
          }
        }
      }
      // 所有选中活动的删除/添加
      if (value.dictCode === '2') {
        const obj = {
          pkgId: this.pkgId,
          chapterId: value.chapterId
        }
        this.$api.activity.listActivity(obj).then(res => {
          if (res.code == 0) {
            const tempList = []
            for (let i = 0; i < res.data.length; i++) {
              for (let j = 0; j < res.data[i].children.length; j++) {
                tempList.push(res.data[i].children[j])
              }
            }
            if (this.groupSelectedAllList.indexOf(value.resgroupId) !== -1) {
              for (let i = 0; i < tempList.length; i++) {
                this.activitySelectedAllList.push(tempList[i])
              }
            } else {
              const temp = []
              const tempArray = []
              for (let i = 0; i < tempList.length; i++) {
                temp[tempList[i]] = typeof tempList[i]
              }
              for (let i = 0; i < this.activitySelectedAllList.length; i++) {
                const type = typeof this.activitySelectedAllList[i]
                if (!temp[this.activitySelectedAllList[i]]) {
                  tempArray.push(this.activitySelectedAllList[i])
                } else if (temp[this.activitySelectedAllList[i]].indexOf(type) < 0) {
                  tempArray.push(this.activitySelectedAllList[i])
                }
              }
              this.activitySelectedAllList = tempArray
            }
          }
        })
      }
    },

    // 当前查看活动复选框的单击操作
    handleActivityCheckbox(value) {
      // 当前操作的是课程节点的活动(未分组活动)
      if (this.isShowClassroomActivity) {
        let temp = true
        for (let i = 0; i < this.classroomActivityListSelected.length; i++) {
          if (value.activityId === this.classroomActivityListSelected[i].activityId) {
            this.classroomActivityListSelected.splice(i, 1)
            i--
            temp = false
          }
        }
        if (temp) {
          this.classroomActivityListSelected.push(value)
        }
        return
      }

      // 活动的增加与删除
      let temp = true
      for (let i = 0; i < this.activitySelectedAllList.length; i++) {
        if (value.activityId === this.activitySelectedAllList[i].activityId) {
          this.activitySelectedAllList.splice(i, 1)
          i--
          temp = false
        }
      }
      if (temp) {
        this.activitySelectedAllList.push(value)
      }
    },

    // 获取章节的所有id和父级id
    getAllChapterParentId(treeData, parentTId) {
      const obj = {
        parentTId: parentTId,
        chapterId: treeData.chapterId
      }
      this.allChapterParentId.push(obj)
      if (treeData.children != null) {
        for (let i = 0; i < treeData.children.length; i++) {
          this.getAllChapterParentId(treeData.children[i], treeData.chapterId)
        }
      }
    },

    // 处理章节没有自动选中父级的数据
    manageChapterSelected() {
      for (let i = 0; i < this.chapterSelected.length; i++) {
        for (let j = 0; j < this.allChapterParentId.length; j++) {
          if (this.chapterSelected[i] === this.allChapterParentId[j].chapterId && this.allChapterParentId[j].parentTId != null) {
            this.chapterSelected.push(this.allChapterParentId[j].parentTId)
            this.addParentChapter(this.allChapterParentId[j].parentTId)
          }
        }
      }
    },

    // 添加父级章节
    addParentChapter(value) {
      for (let j = 0; j < this.allChapterParentId.length; j++) {
        if (value === this.allChapterParentId[j].chapterId && this.allChapterParentId[j].parentTId != null) {
          this.chapterSelected.push(this.allChapterParentId[j].parentTId)
          this.addParentChapter(this.allChapterParentId[j].parentTId)
        }
      }
    },

    // 去重
    unique(arr) {
      return Array.from(new Set(arr))
    },

    // 获取所有选中章节id
    getAllSelectedChapterId(chapter) {
      this.chapterSelected.push(chapter.chapterId)
      if (chapter.children != null) {
        for (let i = 0; i < chapter.children.length; i++) {
          this.getAllSelectedChapterId(chapter.children[i])
        }
      }
    },

    // 处理教材包提交格式
    manageTeachingMaterialData() {
      this.chapterSelected = []
      this.getAllSelectedChapterId(this.sortTreeData[0])
      this.list = []
      for (let i = 0; i < this.chapterSelected.length; i++) {
        let temp = true
        this.chapterDataList.forEach(item => {
          if (item.chapterId === this.chapterSelected[i]) {
            const groupArr = []
            const activityArr = []
            // 获得分组数据
            for (let j = 0; j < this.groupSelectedAllList.length; j++) {
              for (let k = 0; k < item.resgroupList.length; k++) {
                if (this.groupSelectedAllList[j] === item.resgroupList[k].resgroupId) {
                  groupArr.push(this.groupSelectedAllList[j])
                }
              }
            }
            // 获得活动数据
            for (let j = 0; j < this.activitySelectedAllList.length; j++) {
              if (this.chapterSelected[i] === this.activitySelectedAllList[j].chapterId) {
                const activityObj = {
                  activityId: this.activitySelectedAllList[j].activityId,
                  activityType: this.activitySelectedAllList[j].activityType
                }
                activityArr.push(activityObj)
              }
            }
            const tempObj = {
              chapterId: this.chapterSelected[i],
              resgroupIdArray: groupArr,
              activityArray: activityArr
            }
            this.list.push(tempObj)
            temp = false
            return
          }
        })
        if (temp) {
          const obj = {
            pkgId: this.pkgId,
            id: this.chapterSelected[i]
          }
          this.$api.library.findDataDetailsContent(obj).then((res) => {
            if (res.code == 0) {
              const groupArr = []
              const activityArr = []
              // 获得分组数据
              for (let j = 0; j < this.groupSelectedAllList.length; j++) {
                for (let k = 0; k < res.data.pkgResGroupList.length; k++) {
                  if (this.groupSelectedAllList[j] === res.data.pkgResGroupList[k].resgroupId) {
                    groupArr.push(this.groupSelectedAllList[j])
                  }
                }
              }
              // 获得活动数据
              for (let j = 0; j < this.activitySelectedAllList.length; j++) {
                if (this.chapterSelected[i] === this.activitySelectedAllList[j].chapterId) {
                  const activityObj = {
                    activityId: this.activitySelectedAllList[j].activityId,
                    activityType: this.activitySelectedAllList[j].activityType
                  }
                  activityArr.push(activityObj)
                }
              }
              const tempObj = {
                chapterId: this.chapterSelected[i],
                resgroupIdArray: groupArr,
                activityArray: activityArr
              }
              this.list.push(tempObj)
            } else {
              const tempObj = {
                chapterId: this.chapterSelected[i],
                resgroupIdArray: [],
                activityArray: []
              }
              this.list.push(tempObj)
            }
          })
        }
      }
      // console.log(this.activitySelectedAllList)
      // console.log(this.list);
    },

    // 表单验证
    formVerifyBoolean() {
      // 教学包版本号验证
      if (!this.dataFormPckPublic.pkgId) {
        formInVaildStyle('.pkgIdHint', '#pkgId')
        $('#pkgId').css('borderColor', '#dc3545')
        $('#pkgId').focus()
        return false
      } else {
        if ((this.dataFormPckPublic.pkgId) && (!(/^v([1-9]\d|[1-9])(\.([1-9]\d|\d)){2}$/.test(this.dataFormPckPublic.pkgId)))) {
          formInVaildStyle('.pkgIdHint', '#pkgId')
          $('#pkgId').css('borderColor', '#dc3545')
          $('#pkgId').focus()
          return false
        }
      }
      $('#pkgId').removeAttr('style')
      formVaildStyle('.pkgIdHint', '#pkgId')

      // 教学包名称验证
      if (!this.dataFormPckPublic.pkgName) {
        formInVaildStyle('.pkgNameHint', '#pkgName')
        $('#pkgName').css('borderColor', '#dc3545')
        $('#pkgName').focus()
        return false
      }
      $('#pkgName').removeAttr('style')
      formVaildStyle('.pkgNameHint', '#pkgName')

      // 教学包联系人验证
      if (!this.dataFormPckPublic.pkgUserName) {
        formInVaildStyle('.pkgUserNameHint', '#pkgUserName')
        $('#pkgUserName').css('borderColor', '#dc3545')
        $('#pkgUserName').focus()
        return false
      }
      $('#pkgUserName').removeAttr('style')
      formVaildStyle('.pkgUserNameHint', '#pkgUserName')

      // 教学包联系方式验证
      if (!this.dataFormPckPublic.pkgPhone &&
                    !this.dataFormPckPublic.pkgQQ &&
                    !this.dataFormPckPublic.pkgVX &&
                    !this.dataFormPckPublic.pkgEmail) {
        formInVaildStyle('.pkgContactHint', '#pkgPhone')
        $('#pkgPhone').css('borderColor', '#dc3545')
        $('#pkgPhone').focus()
        return false
      } else {
        if ((this.dataFormPckPublic.pkgPhone) && (!(/^1[3456789]\d{9}$/.test(this.dataFormPckPublic.pkgPhone)))) {
          $('.pkgContactHint').html('手机号错误!')
          formInVaildStyle('.pkgContactHint', '#pkgPhone')
          $('#pkgPhone').css('borderColor', '#dc3545')
          $('#pkgPhone').focus()
          return false
        }
        if ((this.dataFormPckPublic.pkgEmail) && (!(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(this.dataFormPckPublic.pkgEmail)))) {
          $('.pkgContactHint').html('邮箱地址错误!')
          formInVaildStyle('.pkgContactHint', '#pkgEmail')
          $('#pkgEmail').css('borderColor', '#dc3545')
          $('#pkgEmail').focus()
          return false
        }
        if ((this.dataFormPckPublic.pkgQQ) && (!(/^[1-9]([0-9]{5,11})$/.test(this.dataFormPckPublic.pkgQQ)))) {
          $('.pkgContactHint').html('QQ错误!')
          formInVaildStyle('.pkgContactHint', '#pkgQQ')
          $('#pkgQQ').css('borderColor', '#dc3545')
          $('#pkgQQ').focus()
          return false
        }
        if ((this.dataFormPckPublic.pkgVX) && (!(/^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/.test(this.dataFormPckPublic.pkgVX)))) {
          $('.pkgContactHint').html('微信错误!')
          formInVaildStyle('.pkgContactHint', '#pkgVX')
          $('#pkgVX').css('borderColor', '#dc3545')
          $('#pkgVX').focus()
          return false
        }
      }
      $('#pkgPhone').removeAttr('style')
      formVaildStyle('.pkgContactHint', '#pkgPhone')

      /* if(!this.dataFormPckPublic.pic){
                    formInVaildStyle('.pkgPic',"");
                    return false;
                }*/
      formVaildStyle('.pkgPic', '')
      return true
    },

    // 排序前的数据处理显示
    getSortData() {
      // 处理要已选中的章节
      this.sortTreeData = JSON.parse(JSON.stringify(this.treeData)) // 深克隆
      this.getSelectedChapter(this.sortTreeData)
    },

    // 递归云盘文件，添加文件夹图标
    recursiveCloudDiskFiles(fileChildren) {
      for (let i = 0; i < fileChildren.length; i++) {
        if (fileChildren[i].type === '1') {
          fileChildren[i].isParent = true
        }
        if (fileChildren[i].children) {
          this.recursiveCloudDiskFiles(fileChildren[i].children)
        }
      }
    },

    // 获取云盘文件选择时，目录数据
    getCloudDiskData() {
      const formData = new FormData()
      formData.append('pkgId', this.pkgId)
      this.$api.pkgInfo.getTree(formData).then(res => {
        if (res.code === 0) {
          this.recursiveCloudDiskFiles(res.data)
          this.cloudDiskData = res.data
          /* let zTreeObj = $.fn.zTree.getZTreeObj("cloudDiskTree");
                    //过滤出为文件夹的节点
                    let folderNode = zTreeObj.getNodesByFilter(function (node) { return node.type == '1'});
                    for(let j=0 ; j<folderNode.length; j++){//遍历目录节点，设置isParent属性为true;
                      folderNode[j].isParent = true;
                      //folderNode[j].open=true;
                      //zTreeObj.reAsyncChildNodes(folderNode[j], "refresh", false);
                      zTreeObj.updateNode(folderNode[j]);
                    }*/
          /* zTreeObj.refresh();//调用api自带的refresh函数。*/
        } else {
          toast(res.msg)
        }
      })
    },

    // 根据章节id获取选中章节的信息
    getSelectedChapter(sortTreeData) {
      for (let i = 0; i < sortTreeData.length; i++) {
        let temp = true
        for (let j = 0; j < this.chapterSelected.length; j++) {
          if (this.chapterSelected[j] === sortTreeData[i].chapterId) {
            temp = false
          }
        }
        if (temp) {
          sortTreeData.splice(i, 1)
          i--
        } else {
          if (sortTreeData[i].children != null) {
            this.getSelectedChapter(sortTreeData[i].children)
          }
        }
      }
    },

    // 上移分组
    moveUpGroup(value) {
      for (let i = 0; i < this.pkgResGroupList.length; i++) {
        if (this.pkgResGroupList[i].resgroupId === value) {
          const tempOption = this.pkgResGroupList[i - 1]
          this.$set(this.pkgResGroupList, i - 1, this.pkgResGroupList[i])
          this.$set(this.pkgResGroupList, i, tempOption)
          break
        }
      }
      for (let i = 0; i < this.groupSelectedAllList.length; i++) {
        if (this.groupSelectedAllList[i] === value) {
          const tempOption = this.groupSelectedAllList[i - 1]
          this.$set(this.groupSelectedAllList, i - 1, this.groupSelectedAllList[i])
          this.$set(this.groupSelectedAllList, i, tempOption)
          break
        }
      }
    },

    // 下移分组
    moveDownGroup(value) {
      for (let i = 0; i < this.pkgResGroupList.length; i++) {
        if (this.pkgResGroupList[i].resgroupId === value) {
          const tempOption = this.pkgResGroupList[i + 1]
          this.$set(this.pkgResGroupList, i + 1, this.pkgResGroupList[i])
          this.$set(this.pkgResGroupList, i, tempOption)
          break
        }
      }
      for (let i = 0; i < this.groupSelectedAllList.length; i++) {
        if (this.groupSelectedAllList[i] === value) {
          const tempOption = this.groupSelectedAllList[i + 1]
          this.$set(this.groupSelectedAllList, i + 1, this.groupSelectedAllList[i])
          this.$set(this.groupSelectedAllList, i, tempOption)
          break
        }
      }
    },

    // 上移活动
    moveUpActivity(value) {
      for (let i = 0; i < this.activityList.length; i++) {
        if (this.activityList[i].activityId === value) {
          const tempOption = this.activityList[i - 1]
          this.$set(this.activityList, i - 1, this.activityList[i])
          this.$set(this.activityList, i, tempOption)
          break
        }
      }
      if (this.isShowClassroomActivity) {
        for (let i = 0; i < this.classroomActivityListSelected.length; i++) {
          if (this.classroomActivityListSelected[i].activityId === value) {
            const tempOption = this.classroomActivityListSelected[i - 1]
            this.$set(this.classroomActivityListSelected, i - 1, this.classroomActivityListSelected[i])
            this.$set(this.classroomActivityListSelected, i, tempOption)
            break
          }
        }
      } else {
        for (let i = 0; i < this.activitySelectedAllList.length; i++) {
          if (this.activitySelectedAllList[i].activityId === value) {
            const tempOption = this.activitySelectedAllList[i - 1]
            this.$set(this.activitySelectedAllList, i - 1, this.activitySelectedAllList[i])
            this.$set(this.activitySelectedAllList, i, tempOption)
            break
          }
        }
      }
    },

    // 下移活动
    moveDownActivity(value) {
      for (let i = 0; i < this.activityList.length; i++) {
        if (this.activityList[i].activityId === value) {
          const tempOption = this.activityList[i + 1]
          this.$set(this.activityList, i + 1, this.activityList[i])
          this.$set(this.activityList, i, tempOption)
          break
        }
      }
      if (this.isShowClassroomActivity) {
        for (let i = 0; i < this.classroomActivityListSelected.length; i++) {
          if (this.classroomActivityListSelected[i].activityId === value) {
            const tempOption = this.classroomActivityListSelected[i + 1]
            this.$set(this.classroomActivityListSelected, i + 1, this.classroomActivityListSelected[i])
            this.$set(this.classroomActivityListSelected, i, tempOption)
            break
          }
        }
      } else {
        for (let i = 0; i < this.activitySelectedAllList.length; i++) {
          if (this.activitySelectedAllList[i].activityId === value) {
            const tempOption = this.activitySelectedAllList[i + 1]
            this.$set(this.activitySelectedAllList, i + 1, this.activitySelectedAllList[i])
            this.$set(this.activitySelectedAllList, i, tempOption)
            break
          }
        }
      }
    },

    /** *
             * 发布方大类
             */
    showDeployMainTypeListData() {
      this.$api.dict.listDeployMainType().then((res) => {
        if (res.code == 0) {
          this.dictListDeployMainType = res.data
          for (let i = 0; i < res.data.length; i++) {
            if (this.pkgInfo && res.data[i].dictValue === this.pkgInfo.deployMainType) {
              this.dataFormPckPublic.deploySubType = res.data[i].dictCode
            }
          }
        }
      })
    },

    /** *
             * 教学包使用限制
             */
    showPkgLimitListData() {
      this.$api.dict.listPkgLimit().then((res) => {
        if (res.code == 0) {
          this.dictListPkgLimit = res.data
          this.dataFormPckPublic.pkgLimit = this.pkgInfo.pkgLimit
        }
      })
    },

    /** *
             * 教学包适用层次
             */
    showPkgLevelListData() {
      this.$api.dict.listPkgLevel().then((res) => {
        if (res.code == 0) {
          this.dictListPkgLevel = res.data
          for (let i = 0; i < res.data.length; i++) {
            if (this.pkgInfo && res.data[i].dictValue === this.pkgInfo.pkgLevel) {
              this.dataFormPckPublic.pkgLevel = res.data[i].dictCode
            }
          }
        }
      })
    }

  }
}
</script>

<style scoped>

  .pck1-span{
    border-left: 4px solid #3198ed;
    padding: 3px 0 3px 10px;
    font-size: 24px;
  }

  .bg-gradient1 span,.bg-gradient1:before {
    background:#52A0FD;
    background:-webkit-linear-gradient(left,#52A0FD 0%,#00e2fa 80%,#00e2fa 100%);
    background:linear-gradient(to right,#52A0FD 0%,#00e2fa 80%,#00e2fa 100%);
  }
  .bg-gradient2 span,.bg-gradient2:before {
    background:#44ea76;
    background:-webkit-linear-gradient(left,#44ea76 0%,#39fad7 80%,#39fad7 100%);
    background:linear-gradient(to right,#44ea76 0%,#39fad7 80%,#39fad7 100%);
  }

  /* fancy Button */
  .fancy-button {
    display:inline-block;
    margin:30px;
    font-family:'Montserrat',Helvetica,Arial,sans-serif;
    font-size:17px;
    letter-spacing:0.03em;
    text-transform:uppercase;
    color:#ffffff;
    position:relative;
  }
  .fancy-button:before {
    content:'';
    display:inline-block;
    height:40px;
    position:absolute;
    bottom:-5px;
    left:30px;
    right:30px;
    z-index:-1;
    border-radius:30em;
    -webkit-filter:blur(20px) brightness(0.95);
    filter:blur(20px) brightness(0.95);
    -webkit-transform-style:preserve-3d;
    transform-style:preserve-3d;
    -webkit-transition:all 0.3s ease-out;
    transition:all 0.3s ease-out;
  }
  .fancy-button i {
    margin-top:-1px;
    margin-right:20px;
    font-size:1.265em;
    vertical-align:middle;
  }
  .fancy-button span {
    display:inline-block;
    padding:18px 60px;
    border-radius:50em;
    position:relative;
    z-index:2;
    will-change:transform,filter;
    -webkit-transform-style:preserve-3d;
    transform-style:preserve-3d;
    -webkit-transition:all 0.3s ease-out;
    transition:all 0.3s ease-out;
  }
  .fancy-button:focus,.fancy-button:active {
    color:#ffffff;
  }
  .fancy-button:hover {
    color:#ffffff;
  }
  .fancy-button:hover span {
    -webkit-filter:brightness(1.05) contrast(1.05);
    filter:brightness(1.05) contrast(1.05);
    -webkit-transform:scale(0.95);
    transform:scale(0.95);
  }
  .fancy-button:hover:before {
    bottom:0;
    -webkit-filter:blur(10px) brightness(0.95);
    filter:blur(10px) brightness(0.95);
  }
  /* 复选框样式 */
  .resources-content input[type="checkbox"]:hover{
    cursor: pointer;
  }
  .resources-content input[type="checkbox"]{
    width:16px;
    height:16px;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    line-height: 18px;
    position: relative;
    margin: -3px 10px 0 10px;
  }
  .resources-content input[type="checkbox"]::before{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background: #fff;
    width: 100%;
    height: 100%;
    border: 1px solid #d9d9d9;
  }
  .resources-content input[type="checkbox"]:checked::before{
    content: "\2713";
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    width:100%;
    border: 1px solid #000000;
    color:#000000;
    font-size: 15px;
    font-weight: bold;
  }
  .margin-bottom-15 span{
    margin: 0 10px;
    cursor: pointer;
  }
  .group-name:hover{
    cursor: pointer;
    color: #007bff;
  }
  .textAlignLeft small{
    margin-left: 150px;
  }
  .hover-color:hover{
    cursor: pointer;
    background-color: #e8f1f4;
  }
    /* 章节选择添加滚动条 */
    .catalogue{
        width: 100%;
        /* min-height: calc(100vh - 110px - 289px - 30px); */
        min-height: 400px;
        overflow-x: hidden;
        overflow-y: scroll;
    }
</style>
