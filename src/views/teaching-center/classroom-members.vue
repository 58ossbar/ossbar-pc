<!-- 课堂成员页面 -->
<template>
  <div class="classroom-rembers-box">
    <div v-if="isShowClassroomRembersMain">
      <!-- <div class="class-member-header">
                <div class="class-member-num">课堂成员（{{classroomMemberNum}}人）</div>
                <div class="member-manger-box">
                    <div
                      v-show="hasPermission && awaitAuditTraineeList.length > 0"
                      class="member-manger"
                      @click="handleShowAwaitAuditDialog">
                        <img class="import-member-icon" src="static/image/teaching_center/audit_1.png" alt="导入">
                        <span>审核成员</span>
                    </div>
                    <div
                      v-show="false"
                      class="member-manger"
                      @click="handleImportClassroomMember">
                        <img class="import-member-icon" src="static/image/teaching_center/import.png" alt="导入">
                        <span>导入课堂成员</span>
                    </div>
                    <div
                      v-show="hasPermission"
                      class="member-manger"
                      @click="handleShowGruopingManager">
                        <i class="fa fa-users" aria-hidden="true" style="line-height: 20px"></i>
                        <span>分组管理</span>
                    </div>
                </div>
            </div> -->
      <div class="class-member-con">
        <div class="class-member-con-left classroom-member-box">

          <!-- 成员小组页面切换tab -->
          <div class="classroom-member-tab">
            <!-- 成员 -->
            <div :class="['tab-classroom-member', tabIndex == 1 ? 'classroom-member-active' : '']" @click="tabIndex = 1">
              课堂成员
            </div>
            <!-- 小组 -->
            <div :class="['tab-classroom-group', tabIndex == 2 ? 'classroom-member-active' : '']" @click="handleShowGruopingManager">
              课堂小组
            </div>
          </div>

          <!-- 成员显示 -->
          <div v-show="tabIndex == 1">
            <!-- 课堂成员搜索 -->
            <div class="search-box" style="display: flex;">
              <!-- <input
                                type="text"
                                v-model="traineeName"
                                @keyup.enter="handleSearchTraineeName"
                                placeholder="搜索"> -->
              <!-- <i class="fa fa-search" aria-hidden="true" style="font-size: 23px" @click="handleSearchTraineeName"></i>-->
              <!-- <img
                                @click="handleSearchTraineeName"
                                src="static/image/search_2.png"
                                alt="搜索"
                                title="搜索"> -->
              <!-- v-if="hasPermission && awaitAuditTraineeList.length > 0" -->
              <el-button
                v-if="permission.hasCheckTraineePermission && awaitAuditTraineeList.length > 0 && !isClassroomFinished"
                type="warning"
                size="mini"
                plain
                class="add-grouping-member-btn"
                style="padding: 7px 10px;"
                icon="el-icon-user-solid"
                @click="handleShowAwaitAuditDialog()"
              >审核成员</el-button>
              <!-- icon="el-icon-user-solid"   style="margin-right:10px;"  -->
              <el-button
                v-if="permission.hasDeleteTraineePermission && listClassroomTrainee.length > 0 && !isClassroomFinished"
                type="danger"
                size="mini"
                plain
                class="add-grouping-member-btn"
                style="margin-right:10px;padding: 7px 10px;"
                icon="el-icon-user-solid"
                @click="handleShowAwaitDelDialog()"
              >移出课堂</el-button>
              <!-- icon="el-icon-user-solid"   style="margin-right:10px;"  -->
              <el-input
                v-model="traineeName"
                placeholder="搜索"
                size="medium"
                suffix-icon="el-icon-search"
                @change="handleSearchTraineeName"
                @keyup.enter.native="handleSearchTraineeName"/>

            </div>

            <!-- 课堂成员显示 -->
            <ul v-if="listClassroomTrainee.length>0" class="class-member-list">
              <li
                v-for="(classroomTrainee,index) in listClassroomTrainee"
                :key="index"
                @click="handleViewTraineeBaseInfo(classroomTrainee)"

              >
                <div v-if="hasPermission || classroomTrainee.state === 'Y'" class="class-member-item">

                  <div class="class-member-info">
                    <div>{{ (classroomMemberPager.currPage-1) * (classroomMemberPager.pageSize) + (index + 1) | filterIndex }}</div>
                    <img
                      :src="classroomTrainee.traineePic"
                      class="user-header-img"
                      alt="">
                    <div class="member-name">
                      <p class="traineeName" style="word-break: break-all;">{{ classroomTrainee.traineeName }}</p>
                      <p class="mobile">{{ classroomTrainee.mobile }}</p>
                    </div>
                  </div>
                  <!-- <div
                                    v-show="hasPermission"
                                    class="pull-down-btn"
                                    @click.stop="showClassroomMember($event,index)">
                                    <i class="fa fa-list-ul"></i>
                                    <ul
                                        id="classroomMember"
                                        :class="['changeTeach','classroomMember'+index,isClassroomPullDown?'changeTeach-bottom':'changeTeach-top']">
                                        <li v-show="classroomTrainee.state === 'N'" @click="handleGetApproved(classroomTrainee.traineeId,'Y')">通过</li>
                                        <li v-show="classroomTrainee.state === 'N'" @click="handleGetApproved(classroomTrainee.traineeId,'N')">不通过</li>
                                        <li v-show="classroomTrainee.state === 'Y' && classroomTrainee.stateName !== '助教'" @click="handleSetTeachingAssistant(classroomTrainee)">设为助教</li>
                                        <li v-show="classroomTrainee.state === 'Y'" @click="showEditTraineeInfo(classroomTrainee)">编辑</li>
                                        <li v-show="classroomTrainee.state === 'Y'" @click="handleDleClassroomTrainee(classroomTrainee)">删除</li>
                                    </ul>
                                </div> -->
                  <el-dropdown v-if="(permission.hasDeleteTraineePermission || permission.hasCheckTraineePermission) && !isClassroomFinished" @command="handleCommand">
                    <span class="el-dropdown-link">
                      <i class="fa fa-list-ul" style="width:30px;" @click.stop=""/>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-show="classroomTrainee.state === 'N' && permission.hasCheckTraineePermission" :command="beforeHandleCommand(1,classroomTrainee)" icon="el-icon-circle-check">通过</el-dropdown-item>
                      <el-dropdown-item v-show="classroomTrainee.state === 'N' && permission.hasCheckTraineePermission" :command="beforeHandleCommand(2,classroomTrainee)" icon="el-icon-circle-close">不通过</el-dropdown-item>
                      <el-dropdown-item v-show="!classroomTrainee.ifTa && classroomTrainee.state === 'Y' && hasPermission" :command="beforeHandleCommand(3,classroomTrainee)" icon="el-icon-star-off">设为助教</el-dropdown-item>
                      <el-dropdown-item v-show="classroomTrainee.ifTa && classroomTrainee.state === 'Y' && hasPermission" :command="beforeHandleCommand(3,classroomTrainee)" icon="el-icon-star-off">取消助教</el-dropdown-item>
                      <el-dropdown-item v-show="classroomTrainee.state === 'Y' && permission.hasEditTraineePermission" :command="beforeHandleCommand(4,classroomTrainee)" icon="el-icon-edit">编辑</el-dropdown-item>
                      <el-dropdown-item v-show="classroomTrainee.state === 'Y' && permission.hasDeleteTraineePermission" :command="beforeHandleCommand(5,classroomTrainee)" icon="el-icon-delete">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <div class="classroom-student-hidden">
                    <div v-show="(classroomTrainee.state === 'N') || (classroomTrainee.stateName === '助教')" :class="['classroom-student-state',(classroomTrainee.state === 'N')?'classroom-student-state-sign':'classroom-student-state-teacher']">
                      <span>{{ classroomTrainee.stateName }}</span>
                    </div>
                  </div>

                </div>
              </li>
            </ul>

            <!-- 课堂成员无数据时显示 -->
            <div v-if="listClassroomTrainee.length<=0" class="no-data-hint">
              <img src="static/image/manage_board/nodate.svg" alt="">
              <p>暂无数据</p>
            </div>

            <!-- 课堂成员分页按钮 -->
            <div class="scroll-btn">
              <img
                v-show="classroomMemberPager.currPage !== 1"
                src="static/image/arrows_up.png"
                alt=""
                style="margin:0 20px;user-select: none;"
                @click="classroomMemberTurnPage(false)">
              <img
                v-show="classroomMemberPager.currPage !== classroomMemberPager.totalPage"
                src="static/image/arrws_down.png"
                alt=""
                style="margin:0 20px;user-select: none;"
                @click="classroomMemberTurnPage(true)">
            </div>
          </div>

          <!-- 小组显示 -->
          <div v-show="tabIndex == 2">
            <div class="left-grouping-box">
              <div class="grouping-top">
                <span>分组列表</span>
                <el-button
                  v-if="groupPermission.hasAddGroupPermission && !isClassroomFinished"
                  type="primary"
                  icon="el-icon-plus"
                  plain
                  size="small"
                  @click="handleIsShowAddGroup">新增分组</el-button>
              </div>
              <ul class="grouping-list">
                <li
                  v-for="(classroomGroupSimpleInfo,index) in listClassroomGroupSimpleInfo"
                  :key="index"
                  :class="['grouping-list-item',index === currentClassMemberIndex ? 'bg-f5f5f5' : '']"
                  @click="handleViewClassroomGroupInfo(classroomGroupSimpleInfo,index)">
                  <div :style="classroomGroupSimpleInfo.isItHere ? 'color: #18b82c' : ''">{{ classroomGroupSimpleInfo.groupName }}</div>
                  <div class="right-arrow">
                    <span :style="classroomGroupSimpleInfo.isItHere ? 'color: #18b82c' : ''">{{ classroomGroupSimpleInfo.number }}</span>
                    <img class="back-icon" src="static/image/teaching_center/right_arrow_1.png">
                  </div>
                </li>
              </ul>
              <div v-if="listClassroomGroupSimpleInfo.length<=0" class="no-data-hint">
                <img src="static/image/manage_board/nodate.svg">
                <p>暂无数据</p>
              </div>
              <div class="grouping-top">
                <span>未分组成员</span>
              </div>
              <div v-for="(item,index) in excludeJoinedGroupAll" :key="index" class="grouping-student">
                <img :src="item.traineePic" alt="" style="width:30px;height:30px;border-radius: 50%;">
                <div>
                  {{ item.traineeName }}
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- 成员基本信息显示 -->
        <div v-show="tabIndex == 1" class="class-member-con-right">
          <div class="head-user-info">
            <img
              :src="baseInfo.traineePic"
              class="user-header-img"
              alt="">
            <div class="user-info">
              <p class="traineeName">{{ baseInfo.traineeName }}</p>
              <p class="remark">{{ baseInfo.remark }}</p>
              <div v-if="hasPermission" class="detail" @click="handleEmpiricalValueDetails(baseInfo.traineeId)">
                <i class="fa fa-file-text" aria-hidden="true" style="font-size: 14px"/>
                <span>经验值明细</span>
              </div>
            </div>
            <div style="margin-left: 60px;">
              <el-button
                v-if="hasPermission && !isClassroomFinished"
                type="primary"
                size="small"
                plain
                style="margin-right:10px;"
                icon="el-icon-circle-plus"
                @click="studentToClassroom">一键加课堂成员</el-button>
            </div>
          </div>
          <div class="chart-con">
            <div class="empirical-value chart-comm">
              <div class="title">
                <span>经验值</span>
                <span class="value">{{ traineeBaseInfo.currRoomEmpiricalValue ? traineeBaseInfo.currRoomEmpiricalValue : 0 }}</span>
              </div>
              <div class="chart">
                <div id="empirical-value-charts" class="charts-left">
                  <div style="width:180px;height:180px;">
                    <div v-if="chartsDate && chartsDate.ringLingInfo && chartsDate.ringLingInfo.array && chartsDate.ringLingInfo.array.length > 0" class="ring-ling-box">
                      <ring-ling
                        id="empirical-value-detail"
                        :data="chartsDate.ringLingInfo.array"
                        width="180"
                        height="180"
                        color="#ff767c,#33d9c7,#fec154"
                        name="经验值详情"
                        rate="50%"/>
                        <!-- :radius="['40%', '50%', '71%']"
                                                -->
                    </div>
                  </div>
                  <div v-if="chartsDate && chartsDate.ringLingInfo && chartsDate.ringLingInfo.array && chartsDate.ringLingInfo.array.length > 0" class="describe">
                    <p v-for="(item0, index0) in chartsDate.ringLingInfo.array" :key="index0">
                      <span :style="[{backgroundColor: (index0 === 0? '#ff767c' : (index0 === 1? '#33d9c7' : '#fec154') )}]" class="color-box"/>
                      <span>{{ item0.name }}</span>
                      <span>{{ chartsDate.ringLingInfo.radius[index0] }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="textbook-study chart-comm">
              <div class="title">
                <span>云教材学习</span>
                <span class="study-rate">{{ chartsDate && chartsDate.meterDiagramInfo && chartsDate.meterDiagramInfo.rate }}</span>
              </div>
              <div class="chart">
                <div id="learning-value-charts" class="charts-left">
                  <gauge
                    id="cloud-materials-study"
                    :data="chartsDate.meterDiagramInfo.list ? chartsDate.meterDiagramInfo.list : [{name:'进度', value: 0}]"
                    name="云教材学习"/>
                  <div class="describe">
                    <p>
                      <span>云教材学习{{ chartsDate && chartsDate.meterDiagramInfo && chartsDate.meterDiagramInfo.rate }}</span>
                    </p>
                    <p>
                      <span>共计学习{{ chartsDate && chartsDate.meterDiagramInfo && chartsDate.meterDiagramInfo.learningTime }}小时</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="member-detail">
            <ul class="detail-list">
              <li class="detail-item">
                <div class="detail-chart">
                  <div class="title">活动参与详情</div>
                  <div style="width:180px;height:180px;">
                    <div v-if="chartsDate && chartsDate.activityInfo && chartsDate.activityInfo.list && chartsDate.activityInfo.list.length > 0" class="ring-ling-box">
                      <ring-ling
                        id="activity-detail"
                        :data="chartsDate.activityInfo ? chartsDate.activityInfo.list : []"
                        width="180"
                        height="180"
                        color="#ff767c,#ddd"
                        name="活动参与率详情"
                        rate="50%"/>
                    </div>
                  </div>

                </div>
                <div class="describe">
                  <p>已参与{{ (chartsDate && chartsDate.activityInfo && chartsDate.activityInfo.totalNum) ? (chartsDate.activityInfo.totalNum): 0 }}项</p>
                  <p>当前有效{{ (chartsDate && chartsDate.activityInfo && chartsDate.activityInfo.currentNum) ? (chartsDate.activityInfo.currentNum): 0 }}项</p>
                </div>
              </li>
              <li class="detail-item">
                <div class="detail-chart">
                  <div class="title">资源查看详情</div>
                  <div style="width:180px;height:180px;">
                    <div v-if="chartsDate && chartsDate.resourceInfo && chartsDate.resourceInfo.list && chartsDate.resourceInfo.list.length > 0" class="ring-ling-box">
                      <ring-ling
                        id="resource-detail"
                        :data="chartsDate.resourceInfo.list"
                        width="180"
                        height="180"
                        name="资源查看率详情"
                        color="#33d9c7"
                        rate="30%"/>
                    </div>
                  </div>
                </div>
                <div class="describe">
                  <p>已查看{{ (chartsDate && chartsDate.resourceInfo && chartsDate.resourceInfo.totalNum) ? (chartsDate.resourceInfo.totalNum): 0 }}个</p>
                  <p>当前有效{{ (chartsDate && chartsDate.resourceInfo && chartsDate.resourceInfo.currentNum) ? (chartsDate.resourceInfo.currentNum): 0 }}个</p>
                </div>
              </li>
              <li class="detail-item">
                <div class="detail-chart">
                  <div class="title">课堂出勤详情</div>
                  <div style="width:180px;height:180px;">
                    <div v-if="chartsDate && chartsDate.attendanceRateInfo && chartsDate.attendanceRateInfo.list && chartsDate.attendanceRateInfo.list.length > 0" class="ring-ling-box">
                      <ring-ling
                        id="classroom-attendance-detail"
                        :data="chartsDate.attendanceRateInfo.list"
                        width="180"
                        height="180"
                        color="#fec154"
                        name="课堂出勤率详情"
                        rate="20%"/>
                        <!-- [{value:10, name:'未出勤率',itemStyle: {
                                            normal: { color: '#fec154' },  //正常颜色
                                            emphasis: { color: '#ffbb5b' }, //鼠标移入颜色
                                            },},{value:20, name:'出勤率'}] -->
                    </div>
                  </div>
                </div>
                <div class="describe">
                  <p>已出勤{{ (chartsDate && chartsDate.attendanceRateInfo && chartsDate.attendanceRateInfo.totalNum) ? (chartsDate.attendanceRateInfo.totalNum): 0 }}次</p>
                  <p>当前有效{{ (chartsDate && chartsDate.attendanceRateInfo && chartsDate.attendanceRateInfo.currentNum) ? (chartsDate.attendanceRateInfo.currentNum): 0 }}次</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="study-case">
            <ul class="case-list">
              <li class="case-item">
                <img src="static/image/earnest_answer.png" alt="">
                <div class="detail">
                  <p>博客数</p>
                  <p class="number">
                    <span class="font-size26 color-8878fd">{{ traineeBaseInfo.blogNums ? traineeBaseInfo.blogNums : 0 }}</span>
                    <span>次</span>
                  </p>
                </div>
              </li>
              <li class="case-item">
                <img src="static/image/like.png" alt="">
                <div class="detail">
                  <p>博客获取点赞</p>
                  <p class="number">
                    <span class="font-size26 color-f19142">{{ traineeBaseInfo.blogLikeNums ? traineeBaseInfo.blogLikeNums : 0 }}</span>
                    <span>次</span>
                  </p>
                </div>
              </li>
              <li class="case-item">
                <img src="static/image/class_expre.png" alt="">
                <div class="detail">
                  <p>课堂表现</p>
                  <p class="number">
                    <span class="font-size26 color-f19142">{{ traineeBaseInfo.performanceData && traineeBaseInfo.performanceData.num ? traineeBaseInfo.performanceData.num : 0 }}</span>
                    <span>次<!--/{{traineeBaseInfo.performanceData && traineeBaseInfo.performanceData.score ? traineeBaseInfo.performanceData.score : 0}}分--></span>
                  </p>
                </div>
              </li>
              <li class="case-item">
                <img src="static/image/video_study.png" alt="">
                <div class="detail">
                  <p>视频学习</p>
                  <p class="number">
                    <span class="font-size26 color-25bef7">{{ traineeBaseInfo.videoStudyData && traineeBaseInfo.videoStudyData.num ? traineeBaseInfo.videoStudyData.num : 0 }}</span>
                    <span>个/{{ traineeBaseInfo.videoStudyData && traineeBaseInfo.videoStudyData.minute ? traineeBaseInfo.videoStudyData.minute : 0 }}分钟</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- 小组信息显示 -->
        <div v-show="tabIndex == 2" class="right-grouping-member-box ">
          <div class="grouping-member-detail-top  classroom-member-box">
            <div class="grouping-member-detail-top-left">
              <div class="grouping-name">{{ viewClassroomGroupInfo.groupName }}({{ viewClassroomGroupInfo.number }}人)</div>

              <div class="search-box">
                <!-- <input
                                    type="text"
                                    v-model="groupRemberName"
                                    @keyup.enter="handleSearchGroupRemberName"
                                    placeholder="搜索">
                                <img
                                    @click="handleSearchGroupRemberName"
                                    src="static/image/search_2.png"
                                    alt="搜索"
                                    title="搜索"> -->
                <el-input
                  v-if="hasPermission && listClassroomGroupSimpleInfo.length > 0"
                  v-model="groupRemberName"
                  placeholder="搜索成员"
                  size="small"
                  suffix-icon="el-icon-search"
                  @change="handleSearchGroupRemberName"
                  @keyup.enter.native="handleSearchGroupRemberName"/>
              </div>
            </div>

            <!-- 右侧分组操作 -->
            <div class="right-btn-list ">
              <!-- 删除当前分组 -->
              <!-- <div class="add-grouping-member-btn" @click="handleRemoveGroup()" v-if="this.listClassroomGroupSimpleInfo.length > 0">
                                <img class="back-icon" src="static/image/teaching_center/del_3.svg">
                                <span>删除分组</span>
                            </div> -->
              <!-- 重命名当前分组 -->
              <!-- <div class="add-grouping-member-btn" @click="handleIsShowEditGroup" v-if="this.listClassroomGroupSimpleInfo.length > 0">
                                <img class="back-icon" src="static/image/teaching_center/edit_1.svg">
                                <span>重命名分组</span>
                            </div> -->
              <!-- 给当前分组添加成员 -->
              <!-- <div class="add-grouping-member-btn" @click="handleShowAddGroupDialog" v-if="this.listClassroomGroupSimpleInfo.length > 0">
                                <img class="back-icon" src="static/image/teaching_center/add_1.svg">
                                <span>添加小组成员</span>
                            </div> -->

              <el-button
                v-if="groupPermission.hasAddGmTraineePermission && listClassroomGroupSimpleInfo.length > 0 && !isClassroomFinished"
                type="primary"
                size="small"
                plain
                class="add-grouping-member-btn"
                icon="el-icon-circle-plus-outline"
                @click="handleShowAddGroupDialog()">添加成员</el-button>
              <!-- 添加小组成员 -->

              <el-button
                v-if="groupPermission.hasDeleteGmTraineePermission && viewClassroomGroupMemberList.length > 0 && !isClassroomFinished"
                type="danger"
                size="small"
                plain
                class="add-grouping-member-btn"
                icon="el-icon-delete"
                @click="handleShowDelGroupMemberDialog('del')">删除成员</el-button>
              <!-- 删除小组成员 -->

              <el-button v-if="groupPermission.hasSetGmLeaderPermission && viewClassroomGroupMemberList.length > 0 && !isClassroomFinished" type="primary" size="small" plain class="add-grouping-member-btn" icon="el-icon-circle-plus-outline" @click="handleShowDelGroupMemberDialog('setting')">设置成员身份</el-button>
              <!-- 批量设置小组成员身份 -->

              <el-button
                v-if="groupPermission.hasRenameGroupPermission && listClassroomGroupSimpleInfo.length > 0 && !isClassroomFinished"
                type="primary"
                size="small"
                plain
                class="add-grouping-member-btn"
                icon="el-icon-edit"
                @click="handleIsShowEditGroup()">重命名分组</el-button>

              <el-button
                v-if="groupPermission.hasDeleteGroupPermission && listClassroomGroupSimpleInfo.length > 0 && !isClassroomFinished"
                type="danger"
                size="small"
                plain
                class="add-grouping-member-btn"
                icon="el-icon-delete-solid"
                @click="handleRemoveGroup()">删除分组</el-button>
                <!-- 返回 -->
                <!-- <div class="back" @click="handleshowRembersMain">
                                <img class="back-icon" style="width: 16px;height: 16px" src="static/image/teaching_center/back_2.svg">
                                <span>返回</span>
                            </div> -->
            </div>

          </div>
          <!-- 当前分组的信息显示开始 -->
          <div class="grouping-member-list-con">
            <!-- 分组数量显示 -->
            <!-- <h3 class="grouping-name"  v-if="classroomGroupInfoPager.totalPage">{{viewClassroomGroupInfo.groupName}}({{viewClassroomGroupInfo.number}}人)</h3> -->
            <!-- 分组成员显示 -->
            <!-- <ul class="grouping-member-list" v-show="viewClassroomGroupMemberList.length>0">
                            <li
                                class="grouping-member-item"
                                :key="index"
                                v-for="(classroomGroupMember,index) in viewClassroomGroupMemberList">
                                /////成员的序号
                                <div class="serial-number">{{(classroomGroupInfoPager.currPage - 1) * classroomGroupInfoPager.pageSize +index+1 | filterIndex}}</div>
                               //////////// 成员的头像以及姓名
                                <div class="member-name">
                                    <img :src="classroomGroupMember.traineePic" alt="头像">
                                    <span>{{classroomGroupMember.traineeName}}</span>
                                </div>
                                //////////////成员的性别
                                <div class="traineeSex">{{classroomGroupMember.traineeSex ? classroomGroupMember.traineeSex : '保密'}}</div>
                                ////////////成员操作按钮是否显示图标
                                <div class="operation">
                                    /// <i
                                   //   class="fa fa-pencil-square-o"
                                   //   aria-hidden="true"
                                   //   title="操作"
                                   //   v-show="!operationButton || operationTraineeId !== classroomGroupMember.traineeId"
                                   //   @click="handleIsShowOperation(classroomGroupMember.traineeId)"
                                   //   style="color: #007bff;font-size: 16px;margin-top: 7px"> 编辑</i>
                                    <el-button
                                      v-if="groupPermission.hasSetGmLeaderPermission && (!operationButton || operationTraineeId !== classroomGroupMember.traineeId) && !isClassroomFinished"
                                      @click="handleIsShowOperation(classroomGroupMember.traineeId)"
                                      size="mini">编辑</el-button>

                                </div>
                               // 成员的操作按钮
                                <transition name="el-fade-in-linear">
                                    <div class="grouping-member-operation" v-if="operationButton && classroomGroupMember.traineeId === operationTraineeId">
                                        // 成为小组组长按钮
                                        ////<el-button type="primary" size="mini" plain @click="handleAddGroupLeader(classroomGroupMember)">成为组长</el-button>

                                        <el-dropdown @command="handleSettingGroupIdentity($event,classroomGroupMember.gmId)">
                                            <el-button type="primary" size="mini" plain>设置身份<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item v-for="(identity, indexi) in identityList" :key="indexi" :command="identity.dictCode" :disabled="classroomGroupMember.dictCode == identity.dictCode">{{identity.dictValue}}</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>

                                       //// 成员删除按钮
                                        <el-button type="danger" size="mini" plain @click="handleRemoveGroupRember(classroomGroupMember)" style="margin-left: 10px;">删除</el-button>
                                        ////操作按钮隐藏按钮
                                        <el-button type="info" size="mini" plain @click="handleIsShowOperation">取消</el-button>
                                    </div>
                                </transition>
                                /////左角标小组组长显示标签
                                ///<div class="group-leader" v-if="classroomGroupMember.isLeader === 'Y'">
                                //    <span>组长</span>
                               //// </div>
                                <div class="group-leader" v-if="classroomGroupMember.dictValue">
                                    <span>{{classroomGroupMember.dictValue}}</span>
                                </div>
                            </li>
                        </ul> -->
            <!-- 小组没有成员所显示的图片 -->
            <!-- <div class="no-data-hint" v-if="viewClassroomGroupMemberList.length<=0">
                            <img src="static/image/manage_board/creatkc.png" alt="">
                            <p>暂无数据</p>
                        </div> -->

            <!-- <div class="grouping-member-table-btns">
                            <h3 class="grouping-name">{{viewClassroomGroupInfo.groupName}}({{viewClassroomGroupInfo.number}}人)</h3>

                            <div  class="right-btn-list ">
                                <el-button type="primary" size="small"  plain  v-if="groupPermission.hasAddGmTraineePermission && this.listClassroomGroupSimpleInfo.length > 0 && !isClassroomFinished" class="add-grouping-member-btn"  @click="handleShowAddGroupDialog()" icon="el-icon-circle-plus-outline">添加小组成员</el-button>

                                <el-button  type="danger" size="small" plain v-if="groupPermission.hasDeleteGmTraineePermission && this.viewClassroomGroupMemberList.length > 0 && !isClassroomFinished" class="add-grouping-member-btn" @click="handleShowDelGroupMemberDialog()" icon="el-icon-delete">删除小组成员</el-button>

                                <el-button type="primary" size="small"  plain  v-if="groupPermission.hasSetGmLeaderPermission && this.viewClassroomGroupMemberList.length > 0 && !isClassroomFinished" class="add-grouping-member-btn"  @click="handleShowAddGroupDialog()" icon="el-icon-circle-plus-outline">批量设置小组成员身份</el-button>

                                <el-button  type="primary" size="small"  plain v-if="groupPermission.hasRenameGroupPermission && this.listClassroomGroupSimpleInfo.length > 0 && !isClassroomFinished"  class="add-grouping-member-btn" @click="handleIsShowEditGroup()" icon="el-icon-edit">重命名分组</el-button>

                                <el-button  type="danger" size="small"  plain  v-if="groupPermission.hasDeleteGroupPermission && this.listClassroomGroupSimpleInfo.length > 0 && !isClassroomFinished"   class="add-grouping-member-btn"  @click="handleRemoveGroup()" icon="el-icon-delete-solid">删除分组</el-button>
                            </div>
                        </div> -->

            <el-table ref="multipleTable" :data="viewClassroomGroupMemberList" height="470px" stripe tooltip-effect="dark" class="grouping-member-list grouping-member-table-list" >
              <!-- <el-table-column type="selection" width="55"></el-table-column>   @selection-change="handleSelectionChange"  -->
              <el-table-column type="index" width="50"/>
              <el-table-column prop="traineeName" label="姓名" show-overflow-tooltip>
                <template slot-scope="scope" >
                  <div class="grouping-member-table-name-wrapper">
                    <el-image :src="scope.row.traineePic" fit="fill" alt="头像" class="grouping-member-table-img"/>
                    <span>{{ scope.row.traineeName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="身份" width="150" show-overflow-tooltip>
                <template slot-scope="scope" ><!--  职务 -->
                  <el-tag v-if="scope.row.dictValue" type="success" effect="plain" disable-transitions>{{ scope.row.dictValue }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="traineeSex" label="性别" width="100">
                <template slot-scope="scope">{{ scope.row.traineeSex || '保密' }}</template>
              </el-table-column>
              <el-table-column label="操作" width="260" show-overflow-tooltip>
                <template slot-scope="scope">  <!--  width="200" align="right" header-align="center" -->
                  <el-button
                    v-if="groupPermission.hasSetGmLeaderPermission && (!operationButton || operationTraineeId !== scope.row.traineeId) && !isClassroomFinished"
                    size="mini"
                    @click="handleIsShowOperation(scope.row.traineeId)">编辑</el-button>

                  <!-- 成为小组组长按钮   v-if="groupPermission.hasSetGmLeaderPermission && !isClassroomFinished" -->
                  <el-dropdown v-if="operationButton && scope.row.traineeId === operationTraineeId" @command="handleSettingGroupIdentity($event,scope.row.gmId,'single')" >
                    <el-button type="primary" size="mini" plain>设置身份<i class="el-icon-arrow-down el-icon--right"/></el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="(identity, indexi) in identityList" :key="indexi" :command="identity.dictCode" :disabled="scope.row.dictCode == identity.dictCode">{{ identity.dictValue }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>

                  <!-- 成员删除按钮 -->
                  <el-button v-if="operationButton && scope.row.traineeId === operationTraineeId" type="danger" size="mini" plain style="margin-left: 10px;" @click="handleRemoveGroupRember(scope.row)" >删除</el-button>
                  <!-- 操作按钮隐藏按钮 -->
                  <el-button v-if="operationButton && scope.row.traineeId === operationTraineeId" type="info" size="mini" plain @click="handleIsShowOperation">取消</el-button>

                </template>
              </el-table-column>
            </el-table>

            <!-- 小组成员的分页 -->
            <div>
              <pager
                v-if="classroomGroupInfoPager.totalPage"
                :page-size-prop="classroomGroupInfoPager.pageSizeProp"
                :curr-page="classroomGroupInfoPager.currPage"
                :total-page="classroomGroupInfoPager.totalPage"
                align="center"
                @changeIndex="changeClassroomGroupInfoPagerIndex"
              />
            </div>
          </div>
          <!-- 当前分组的成员显示结束 -->
        </div>

      </div>
    </div>
    <!-- 编辑学生信息弹出框begin -->
    <modal-dialog
      id="edit-trainee-info"
      title="编辑信息"
      @cancel="cancelEditTraineeInfo"
      @submit="handleEditTraineeInfo">
      <div slot="main">
        <div class="group-form">
          <div class="group-name" style="height: 178px">
            头像
            <span>*</span>
          </div>
          <el-upload
            :show-file-list="false"
            :http-request="changeImage"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            class="avatar-uploader"
            action="#">
            <img v-if="editTraineeInfo.srcImg" :src="editTraineeInfo.srcImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </div>
        <div class="group-form">
          <div class="group-name">
            性别
            <span>*</span>
          </div>
          <el-select id="traineeSex" v-model="editTraineeInfo.sex" class="group-input">
            <el-option v-for="(item,index) in traineeSexList" :key="index" :value="item.id" :label="item.value"/>
          </el-select>
        </div>
        <div class="group-form">
          <div class="group-name">
            姓名
            <span>*</span>
          </div>
          <el-input
            id="traineeName"
            v-model="editTraineeInfo.name"
            type="text"
            maxlength="20"
            class="group-input"
            placeholder="请输入姓名"
            @keyup.enter="handleEditTraineeInfo"/>
        </div>
        <div class="group-form">
          <div class="group-name">
            昵称
            <span>*</span>
          </div>
          <el-input
            id="nickName"
            v-model="editTraineeInfo.nickName"
            type="text"
            maxlength="20"
            class="group-input"
            placeholder="请输入昵称"
            @keyup.enter="handleEditTraineeInfo"/>
        </div>
        <!-- <div class="group-form">
                    <div class="group-name">
                        手机号
                        <span>*</span>
                    </div>
                    <input
                    type="text"
                    maxlength="11"
                    id="traineeMobile"
                    v-model="editTraineeInfo.mobile"
                    @keyup.enter="handleEditTraineeInfo"
                    class="form-control group-input"
                    placeholder="请输入手机号">
                </div>
                <div class="invalid-feedback col-10 textAlignLeft p-0 pkgTraineeMobileHint"><small >手机号码错误！</small></div> -->
      </div>
    </modal-dialog>
    <!-- 编辑学生信息弹出框end -->
    <!-- 经验值明细模态框开始 -->
    <modal-dialog
      id="empirical-value-details-dialog"
      ref="experience"
      :width="'800px'"
      :is-show-footer-btn="false"
      title="经验值明细">
      <div slot="main">
        <!-- 所有经验明细显示开始 -->
        <div class="empirical">
          <!-- 内容 -->
          <div class="empirical-content">
            <el-table
              :data="empiricalValueInfo"
              :header-cell-style="{background:'#F3F4F7',color:'#555'}"
              height="288px"
              style="width: 100%">
              <el-table-column
                prop="createTime"
                label="日期"
                width="160"/>
              <el-table-column
                prop="msg"
                label="操作"
                width="800">
                <template slot-scope="scope">
                  <span :title="scope.row.msg" class="empirical-msg">{{ scope.row.msg }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="empiricalValue"
                align="center"
                label="经验值"/>
            </el-table>
            <!-- 分页信息 -->
            <div>
              <pager
                v-if="experienceValueInfoPager.totalPage"
                :page-size-prop="experienceValueInfoPager.pageSizeProp"
                :curr-page="experienceValueInfoPager.currPage"
                :total-page="experienceValueInfoPager.totalPage"
                align="center"
                @changeIndex="changeExperienceValueIndex"
              />
            </div>
          </div>
        </div>
        <!-- 所有经验明细显示结束 -->
      </div>
    </modal-dialog>
    <!-- 经验值明细模态框结束 -->
    <!-- 待审核成员列表start -->
    <modal-dialog
      id="await-audit-trainee-dialog"
      ref="awaitAuditTraineeDialog"
      :is-show-footer-btn="false"
      title="待审核成员列表"
      @cancel="cancelAwaitAuditTrainee">
      <div slot="main">
        <div class="main-top classroom-member-box">
          <div class="search-box">
            <!-- <input
                            type="text"
                            v-model="awaitAuditTraineePagerInfo.traineeName"
                            placeholder="搜索">
                        <img
                            @click="handleSearchAwaitAuditTraineePagerInfoName"
                            src="static/image/search_2.png"
                            alt="搜索"
                            title="搜索"> -->
            <el-input
              v-model="awaitAuditTraineePagerInfo.traineeName"
              placeholder="搜索"
              size="medium"
              suffix-icon="el-icon-search"
              @change="handleSearchAwaitAuditTraineePagerInfoName"
              @keyup.enter.native="handleSearchAwaitAuditTraineePagerInfoName"/>
          </div>

        </div>
        <div class="main-list-top">
          <div class="left-operation-box">
            <div class="Check-all" @click="handleCheckAllAwaitAuditTrainee">
              <input v-model="isCheckAllAwaitAuditTrainee" type="checkbox">
              <span>全选</span>
            </div>
            <div class="selected-member-num">共{{ awaitAuditTraineePagerInfo.totalCount }}人/已选择{{ selectAwaitAuditTrainee.length }}人</div>
          </div>
          <div class="sure-btn" @click="handlePassAudit('N')">不通过审核</div>
          <div class="sure-btn" @click="handlePassAudit('Y')">通过审核</div>
        </div>
        <ul class="main-list awaitAuditTraineeDialogMainList">
          <li
            v-for="(awaitAuditTraine,index) in awaitAuditTraineeList"
            :key="index"
            class="main-list-item"
            @click="handleSelectAwaitAuditTrainee(awaitAuditTraine)">
            <input v-model="awaitAuditTraine.isSelect" type="checkbox">
            <div class="trainee-info">
              <img :src="awaitAuditTraine.traineePic" alt="头像">
              <span>{{ awaitAuditTraine.traineeName }}</span>
            </div>
          </li>
        </ul>
        <div v-if="awaitAuditTraineeList.length<=0" class="no-data-hint">
          <img src="static/image/manage_board/nodate.svg" alt="提示">
          <p>暂无待审核成员</p>
        </div>
        <div >
          <pager
            v-if="awaitAuditTraineePagerInfo.totalPage"
            :page-size-prop="awaitAuditTraineePagerInfo.pageSizeProp"
            :curr-page="awaitAuditTraineePagerInfo.currPage"
            :total-page="awaitAuditTraineePagerInfo.totalPage"
            align="center"
            @changeIndex="changeAwaitAuditTraineeIndex"
          />
        </div>
      </div>
    </modal-dialog>
    <!-- 待审核成员列表end -->

    <!-- 移出课堂 成员列表start -->
    <modal-dialog
      id="await-del-trainee-dialog"
      ref="awaitDelTraineeDialog"
      :is-show-footer-btn="false"
      title="成员列表"
      @cancel="cancelAwaitDelTrainee">
      <div slot="main">
        <div class="main-top classroom-member-box">
          <div class="search-box search-box-del">
            <el-input v-model="awaitDelTraineePagerInfo.traineeName" placeholder="输入姓名" size="medium" clearable @change="handleSearchAwaitDelTraineePagerInfoName" @keyup.enter.native="handleSearchAwaitDelTraineePagerInfoName" />

            <el-input v-model="awaitDelTraineePagerInfo.mobile" placeholder="输入手机号码" size="medium" clearable @change="handleSearchAwaitDelTraineePagerInfoName" @keyup.enter.native="handleSearchAwaitDelTraineePagerInfoName" />
            <!-- suffix-icon="el-icon-search" -->

            <el-button type="primary" size="medium" plain class="add-grouping-member-btn" icon="el-icon-search" @click="handleSearchAwaitDelTraineePagerInfoName()">搜索</el-button>

          </div>

        </div>
        <div class="main-list-top">
          <div class="left-operation-box">
            <div class="Check-all" @click="handleCheckAllAwaitDelTrainee">
              <input v-model="isCheckAllAwaitDelTrainee" type="checkbox">
              <span>全选</span>
            </div>
            <div class="selected-member-num">共{{ awaitDelTraineePagerInfo.totalCount }}人/已选择{{ selectAwaitDelTrainee.length }}人</div>
          </div>
          <div class="sure-btn" @click="handleDelMembers()">移出课堂</div>
        </div>
        <ul v-if="awaitDelTraineeList && awaitDelTraineeList.length> 0" class="main-list  main-list-del">
          <li
            v-for="(awaitDelTrainee,index) in awaitDelTraineeList"
            :key="index"
            :title="awaitDelTrainee.traineeName"
            class="main-list-item"
            @click="handleSelectAwaitDelTrainee(awaitDelTrainee)">
            <input v-model="awaitDelTrainee.isSelect" type="checkbox">
            <!-- <div class="trainee-info"> -->
            <img :src="awaitDelTrainee.traineePic" alt="头像">
            <span>{{ awaitDelTrainee.traineeName }}</span>
            <!-- </div> -->
          </li>
        </ul>
        <div v-if="awaitDelTraineeList.length<=0" class="no-data-hint">
          <img src="static/image/manage_board/nodate.svg" alt="提示">
          <p>暂无成员</p>
        </div>
        <div >
          <pager
            v-if="awaitDelTraineePagerInfo.totalPage"
            :page-size-prop="awaitDelTraineePagerInfo.pageSizeProp"
            :curr-page="awaitDelTraineePagerInfo.currPage"
            :total-page="awaitDelTraineePagerInfo.totalPage"
            align="center"
            @changeIndex="changeAwaitDelTraineeIndex"
          />
        </div>
      </div>
    </modal-dialog>
    <!-- 移出课堂 列表end -->

    <!--  班级学员start-->
    <div v-if="isShowImportCalssMembers" class="import-calss-members-box">
      <div class="location bg-fafafa">
        <div class="localtion-title"><b>当前位置:</b></div>
        <ul class="localtion-list">
          <li class="localtion-item" @click="handleshowRembersMain">
            课堂成员
          </li>
          <li class="localtion-item">
            班级成员列表
          </li>
        </ul>
      </div>
      <div class="import-calss-members-con">
        <div class="top-menu-box classroom-member-box">
          <div class="search-box ">
            <el-input
              v-model="classMemberName"
              placeholder="搜索"
              size="medium"
              suffix-icon="el-icon-search"
              @change="handleSearchClassMember"
              @keyup.enter.native="handleSearchClassMember"/>
          </div>
          <div class="right-operation-box">
            <div class="selected-member-num">共{{ classMemberNumPeople }}人/已选择{{ selectListClassTrainee.length }}人</div>
            <div
              class="impotr-btn"
              @click="handleImportTraineeBatch">
              <img class="import-member-icon" src="static/image/teaching_center/import.png" alt="导入">
              <span>导入成班课成员</span>
            </div>
            <div class="back" @click="handleshowRembersMain">
              <img class="back-icon" src="static/image/teaching_center/back_2.png">
              <span>返回</span>
            </div>
          </div>
        </div>
        <table class="comm-table">
          <tr class="t-head">
            <th>
              <span @click="handleCheckAll">
                <input v-model="isCheckAll" type="checkbox">全选
              </span>
            </th>
            <th>姓名</th>
            <th>学号</th>
            <th>班级</th>
            <th>性别</th>
          </tr>
          <tr
            v-for="(classTrainee,index) in listClassTrainee"
            :key="index"
            class="t-body"
            @click="handleSelectClassTrainee(classTrainee,index)">
            <td>
              <input v-model="classTrainee.isSelect" type="checkbox">
            </td>
            <td>
              <img :src="classTrainee.traineePic" alt="学生头像">
              <span>{{ classTrainee.traineeName }}</span>
            </td>
            <td>13456789</td>
            <td>{{ classTrainee.className }}</td>
            <td>{{ classTrainee.traineeSex | filterSex }}</td>
          </tr>
        </table>
        <div v-if="listClassTrainee.length<=0" class="no-data-hint">
          <img src="static/image/manage_board/nodate.svg" alt="">
          <p>暂无数据</p>
        </div>
        <div >
          <pager
            v-if="pagerInfo.totalPage"
            :page-size-prop="pagerInfo.pageSizeProp"
            :curr-page="pagerInfo.currPage"
            :total-page="pagerInfo.totalPage"
            align="center"
            @changeIndex="changeIndex"
          />
        </div>
      </div>
    </div>
    <!--  班级学员end-->
    <!-- 成员小组方案管理start -->
    <div v-if="isShowGroupingManager" class="grouping-manager-box">
      <div class="location bg-fafafa">
        <div class="localtion-title">
          <b>当前位置:</b>
        </div>
        <ul class="localtion-list">
          <li class="localtion-item" style="cursor: pointer;" @click="handleshowRembersMain">
            课堂成员
          </li>
          <li class="localtion-item">
            <span style="color: #959da0;">分组管理</span>
          </li>
        </ul>
      </div>
      <div class="grouping-manage-con">
        <div class="left-grouping-box ">
          <div class="grouping-top">
            <span>分组列表</span>
            <b-button
              variant="outline-primary"
              size="sm"
              @click="handleIsShowAddGroup">+新增分组</b-button>
          </div>
          <ul class="grouping-list">
            <li
              v-for="(classroomGroupSimpleInfo,index) in listClassroomGroupSimpleInfo"
              :key="index"
              :class="['grouping-list-item',index === currentClassMemberIndex ? 'bg-f5f5f5' : '']"
              @click="handleViewClassroomGroupInfo(classroomGroupSimpleInfo,index)">
              <div>{{ classroomGroupSimpleInfo.groupName }}</div>
              <div class="right-arrow">
                <span>{{ classroomGroupSimpleInfo.number }}</span>
                <img class="back-icon" src="static/image/teaching_center/right_arrow_1.png">
              </div>
            </li>
          </ul>
          <div v-if="listClassroomGroupSimpleInfo.length<=0" class="no-data-hint">
            <img src="static/image/manage_board/nodate.svg">
            <p>暂无数据</p>
          </div>
        </div>
        <div class="right-grouping-member-box ">
          <div class="grouping-member-detail-top  classroom-member-box">
            <div class="search-box">
              <input
                v-model="groupRemberName"
                type="text"
                placeholder="搜索"
                @keyup.enter="handleSearchGroupRemberName">
              <img
                src="static/image/search_2.png"
                alt="搜索"
                title="搜索"
                @click="handleSearchGroupRemberName">
            </div>
            <!-- 右侧分组操作 -->
            <div class="right-btn-list ">
              <!-- 删除当前分组 -->
              <div v-if="listClassroomGroupSimpleInfo.length > 0" class="add-grouping-member-btn" @click="handleRemoveGroup()">
                <img class="back-icon" src="static/image/teaching_center/del_3.svg">
                <span>删除分组</span>
              </div>
              <!-- 重命名当前分组 -->
              <div v-if="listClassroomGroupSimpleInfo.length > 0" class="add-grouping-member-btn" @click="handleIsShowEditGroup">
                <img class="back-icon" src="static/image/teaching_center/edit_1.svg">
                <span>重命名分组</span>
              </div>
              <!-- 给当前分组添加成员 -->
              <div v-if="listClassroomGroupSimpleInfo.length > 0" class="add-grouping-member-btn" @click="handleShowAddGroupDialog">
                <img class="back-icon" src="static/image/teaching_center/add_1.svg">
                <span>添加小组成员</span>
              </div>
              <!-- 返回 -->
              <div class="back" @click="handleshowRembersMain">
                <img class="back-icon" style="width: 16px;height: 16px" src="static/image/teaching_center/back_2.svg">
                <span>返回</span>
              </div>
            </div>

          </div>
          <!-- 当前分组的信息显示开始 -->
          <div class="grouping-member-list-con">
            <!-- 分组数量显示 -->
            <h3 v-if="classroomGroupInfoPager.totalPage" class="grouping-name">{{ viewClassroomGroupInfo.groupName }}({{ viewClassroomGroupInfo.number }}人)</h3>
            <!-- 分组成员显示 -->
            <ul v-show="viewClassroomGroupMemberList.length>0" class="grouping-member-list">
              <li
                v-for="(classroomGroupMember,index) in viewClassroomGroupMemberList"
                :key="index"
                class="grouping-member-item">
                <!-- 成员的序号 -->
                <div class="serial-number">{{ (classroomGroupInfoPager.currPage - 1) * classroomGroupInfoPager.pageSize +index+1 | filterIndex }}</div>
                <!-- 成员的头像以及姓名 -->
                <div class="member-name">
                  <img :src="classroomGroupMember.traineePic" alt="头像">
                  <span>{{ classroomGroupMember.traineeName }}</span>
                </div>
                <!-- 成员的性别 -->
                <div class="traineeSex">{{ classroomGroupMember.traineeSex ? classroomGroupMember.traineeSex : '保密' }}</div>
                <!-- 成员操作按钮是否显示图标 -->
                <div class="operation">
                  <!--<i
                                      class="fa fa-pencil-square-o"
                                      aria-hidden="true"
                                      title="操作"
                                      v-show="!operationButton || operationTraineeId !== classroomGroupMember.traineeId"
                                      @click="handleIsShowOperation(classroomGroupMember.traineeId)"
                                      style="color: #007bff;font-size: 16px;margin-top: 7px"> 编辑</i>-->
                  <el-button
                    v-show="(!operationButton || operationTraineeId !== classroomGroupMember.traineeId) && !isClassroomFinished"
                    size="mini"
                    @click="handleIsShowOperation(classroomGroupMember.traineeId)">编辑</el-button>

                </div>
                <!-- 成员的操作按钮 -->
                <transition name="el-fade-in-linear">
                  <div v-show="operationButton && classroomGroupMember.traineeId === operationTraineeId" class="grouping-member-operation">
                    <!-- 成为小组组长按钮 -->
                    <el-button type="primary" size="mini" plain @click="handleAddGroupLeader(classroomGroupMember)">成为组长</el-button>

                    <!-- <el-dropdown>
                                            <el-button type="primary" size="mini" plain>设置身份<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item v-for="(identity, indexi) in identityList" :key="indexi">{{identity.dictValue}}</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown> -->

                    <!-- 成员删除按钮 -->
                    <el-button type="danger" size="mini" plain @click="handleRemoveGroupRember(classroomGroupMember)">删除</el-button>
                    <!-- 操作按钮隐藏按钮 -->
                    <el-button type="info" size="mini" plain @click="handleIsShowOperation">取消</el-button>
                  </div>
                </transition>
                <!-- 左角标小组组长显示标签 -->
                <div v-show="classroomGroupMember.isLeader === 'Y'" class="group-leader">
                  <span>组长</span>
                </div>
              </li>
            </ul>
            <!-- 小组没有成员所显示的图片 -->
            <div v-if="viewClassroomGroupMemberList.length<=0" class="no-data-hint">
              <img src="static/image/manage_board/creatkc.png" alt="">
              <p>暂无数据</p>
            </div>
            <!-- 小组成员的分页 -->
            <div>
              <pager
                v-if="classroomGroupInfoPager.totalPage"
                :page-size-prop="classroomGroupInfoPager.pageSizeProp"
                :curr-page="classroomGroupInfoPager.currPage"
                :total-page="classroomGroupInfoPager.totalPage"
                align="center"
                @changeIndex="changeClassroomGroupInfoPagerIndex"
              />
            </div>
          </div>
          <!-- 当前分组的成员显示结束 -->
        </div>
      </div>

    </div>
    <!-- 成员小组方案管理end -->
    <!-- 新建课堂小组start -->
    <modal-dialog
      id="add-classroom-group"
      title="创建课堂小组"
      @cancel="handleAddGroupCancel"
      @submit="handleAddGroupSubmit">
      <div slot="main">
        <div v-for="(item,index) in groupNameList" :key="index" class="group-form">
          <div class="group-name">
            分组{{ index + 1 }}名称
            <span>*</span>
          </div>
          <input
            :id="'groupName' + index"
            v-model="item.groupName"
            type="text"
            maxlength="20"
            class="form-control group-input"
            placeholder="请输入分组名称"
            @keyup.enter="handleAddGroupSubmit"
          >
          <img
            v-if="groupNameList.length > 1"
            class="del-group-input"
            title="删除分组"
            src="static/image/teaching_package/delete_2.png"
            alt="删除分组"
            @click="delGroupInput(index)">
        </div>
        <div
          class="add-group-input-btn"
          @click="addGroupInput">
          <span>+  添加分组</span>
        </div>
      </div>
    </modal-dialog>
    <!-- 新建课堂小组end -->
    <!-- 重命名课堂小组start -->
    <modal-dialog
      id="edit-classroom-group"
      title="重命名小组"
      @cancel="handleEditGroupCancel"
      @submit="handleEditGroupSubmit">
      <div slot="main">
        <div class="group-form">
          <div class="group-name">
            分组名称
            <span>*</span>
          </div>
          <input
            id="optionName"
            v-model="classroomGroupEditName"
            type="text"
            maxlength="20"
            class="form-control group-input"
            placeholder="请输入分组名称"
            @keyup.enter="handleEditGroupSubmit">
        </div>
      </div>
    </modal-dialog>
    <!-- 重命名课堂小组end -->
    <!-- 未加入课堂小组成员列表start -->
    <modal-dialog
      id="no-join-class-group-trainee-list"
      ref="noJoinClassGroupTraineeList"
      :is-show-footer-btn="false"
      title="添加小组成员"
      @cancel="cancelAddClassGroupTrainee">
      <div slot="main">
        <div class="main-top classroom-member-box">
          <div class="search-box">
            <!-- <input
                            type="text"
                            @keyup.enter="handleSearchNoJoinClassTraineeName"
                            v-model="noJoinClassTraineePager.traineeName"
                            placeholder="搜索">
                        <img
                            @click="handleSearchNoJoinClassTraineeName"
                            src="static/image/search_2.png"
                            alt="搜索"
                            title="搜索"> -->
            <el-input
              v-model="noJoinClassTraineePager.traineeName"
              placeholder="搜索"
              size="small"
              suffix-icon="el-icon-search"
              @change="handleSearchNoJoinClassTraineeName"
              @keyup.enter.native="handleSearchNoJoinClassTraineeName"/>
          </div>
        </div>
        <div class="main-list-top">
          <div class="left-operation-box">
            <div class="Check-all" @click="handleCheckAllNoJoinClassTrainee">
              <input v-model="isCheckAllNoJoinClassTrainee" type="checkbox">
              <span>全选</span>
            </div>
            <div class="selected-member-num">共{{ noJoinClassTraineePager.totalCount }}人/已选择{{ selectnoJoinClassTrainee.length }}人</div>
          </div>
          <div class="sure-btn" @click="addClassGroupTrainee">添加</div>
        </div>

        <ul v-if="listClassroomTraineeExcludeJoinedGroup.length>0" class="main-list main-list-del awaitAuditTraineeDialogMainList">
          <li
            v-for="(noJoinTrainee,index) in listClassroomTraineeExcludeJoinedGroup"
            :key="index"
            class="main-list-item"
            @click="handleSelectNoJoinTrainee(noJoinTrainee)">
            <input v-model="noJoinTrainee.isSelect" type="checkbox">
            <!-- <div class="trainee-info"> -->
            <img :src="noJoinTrainee.traineePic" alt="">
            <span>{{ noJoinTrainee.traineeName }}</span>
            <!-- </div> -->
          </li>
        </ul>

        <!-- <ul class="main-list" v-if="listClassroomTraineeExcludeJoinedGroup.length>0">
                    <li
                        @click="handleSelectNoJoinTrainee(noJoinTrainee)"
                        class="main-list-item"
                        :key="index"
                        v-for="(noJoinTrainee,index) in listClassroomTraineeExcludeJoinedGroup">
                        <input type="checkbox" v-model="noJoinTrainee.isSelect">
                        <div class="trainee-info">
                            <img :src="noJoinTrainee.traineePic" alt="">
                            <span>{{noJoinTrainee.traineeName}}</span>
                        </div>
                    </li>
                </ul> -->
        <div v-if="listClassroomTraineeExcludeJoinedGroup.length<=0" class="no-data-hint" style="margin: 20px 0;">
          <img src="static/image/manage_board/nodate.svg" alt="">
          <p>暂无数据</p>
        </div>
        <div >
          <pager
            v-if="noJoinClassTraineePager.totalPage"
            :page-size-prop="noJoinClassTraineePager.pageSizeProp"
            :curr-page="noJoinClassTraineePager.currPage"
            :total-page="noJoinClassTraineePager.totalPage"
            align="center"
            @changeIndex="changeNoJoinClassTraineeIndex"
          />
        </div>
      </div>
    </modal-dialog>
    <!-- 未加入课堂小组成员列表end -->

    <!-- 批量删除小组成员列表start -->
    <modal-dialog
      id="del-group-trainee-list"
      ref="delGroupTraineeList"
      :title="groupIsDelOrSetting && groupIsDelOrSetting == 'setting'?'设置小组成员身份':'删除小组成员'"
      :is-show-footer-btn="false"
      @cancel="cancelDelGroupTrainee">
      <div slot="main" >
        <div class="main-top classroom-member-box">
          <!-- :class="[groupIsDelOrSetting && groupIsDelOrSetting == 'setting'?'search-box-setting-identity':'']" -->
          <div class="search-box search-box-setting-identity" >
            <!-- <el-input
                            placeholder="搜索"
                            size="small"
                            @change="handleSearchDelGroupMemberTraineeName"
                            @keyup.enter.native="handleSearchDelGroupMemberTraineeName"
                            v-model="delGroupTraineePager.traineeName"
                            suffix-icon="el-icon-search">
                        </el-input> -->

            <el-input v-model="delGroupTraineePager.traineeName" placeholder="输入姓名" size="medium" clearable @change="handleSearchDelGroupMemberTraineeName" @keyup.enter.native="handleSearchDelGroupMemberTraineeName" />

            <el-input v-model="delGroupTraineePager.mobile" placeholder="输入手机号码" size="medium" clearable @change="handleSearchDelGroupMemberTraineeName" @keyup.enter.native="handleSearchDelGroupMemberTraineeName" />
            <!-- suffix-icon="el-icon-search" -->

            <el-select v-model="delGroupTraineePager.dictCode" clearable placeholder="请选择" size="medium" @change="handleSearchDelGroupMemberTraineeName()">
              <el-option
                v-for="item in identityList"
                :key="item.dictCode"
                :label="item.dictValue"
                :value="item.dictCode"/>
            </el-select>

            <el-button type="primary" size="medium" plain class="add-grouping-member-btn" icon="el-icon-search" @click="handleSearchDelGroupMemberTraineeName()">搜索</el-button>

          </div>
        </div>
        <div class="main-list-top">
          <div class="left-operation-box">
            <div class="Check-all" @click="handleCheckAllDelGroupMemberTrainee">
              <input v-model="isCheckAllDelGroupMemberTrainee" type="checkbox">
              <span>全选</span>
            </div>
            <div class="selected-member-num">共{{ delGroupTraineePager.totalCount }}人/已选择{{ selectDelGroupTrainee.length }}人</div>
          </div>
          <!-- <div class="sure-btn" @click="handleDelGroupMembers" v-if="groupIsDelOrSetting && groupIsDelOrSetting == 'setting'">删除</div> -->
          <!-- 成为小组组长按钮   v-if="groupPermission.hasSetGmLeaderPermission && !isClassroomFinished" -->
          <el-dropdown v-if="groupIsDelOrSetting && groupIsDelOrSetting == 'setting'" @command="handleSettingGroupIdentity($event,null,'all')" >
            <div class="sure-btn">设置身份<i class="el-icon-arrow-down el-icon--right"/></div>
            <!-- <el-button type="primary" size="mini" plain>设置身份<i class="el-icon-arrow-down el-icon--right"></i></el-button> -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(identity, indexi) in identityList" :key="indexi" :command="identity.dictCode" >{{ identity.dictValue }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div v-else class="sure-btn" @click="handleDelGroupMembers">删除</div>
        </div>

        <ul v-if="listDelGroupMember.length>0" class="main-list main-list-del awaitAuditTraineeDialogMainList">
          <li
            v-for="(delGroupTrainee,index) in listDelGroupMember"
            :key="index"
            class="main-list-item"
            @click="handleSelectDelGroupMemberTrainee(delGroupTrainee)">
            <input v-model="delGroupTrainee.isSelect" type="checkbox">
            <!-- <div class="trainee-info"> -->
            <img :src="delGroupTrainee.traineePic" alt="">
            <span>{{ delGroupTrainee.traineeName }}</span>
            <!-- </div> -->
          </li>
        </ul>

        <div v-if="listDelGroupMember.length<=0" class="no-data-hint" style="margin: 20px 0;">
          <img src="static/image/manage_board/nodate.svg" alt="">
          <p>暂无数据</p>
        </div>
        <div >
          <pager
            v-if="delGroupTraineePager.totalPage"
            :curr-page="delGroupTraineePager.currPage"
            :page-size-prop="delGroupTraineePager.pageSizeProp"
            :total-page="delGroupTraineePager.totalPage"
            align="center"
            @changeIndex="changeDelGroupMemberTraineeIndex"
          />
        </div>
      </div>
    </modal-dialog>
    <!-- 批量 删除小组成员列表end -->

    <!-- 一键添加课堂成员弹出框start -->
    <modal-dialog
      id="to-classroom"
      title="选择课堂"
      @cancel="handleToClassroomCancel"
      @submit="handleToClassroomSubmit">
      <div slot="main">
        <div class="selection-class">
          <div style="width:25%;line-height: 38px;">
            课堂选择：
          </div>
          <el-select
            v-model="currSelectionClass"
            :popper-append-to-body="false"
            popper-class="select-popper"
            style="width: 100%"
            multiple
            filterable
            default-first-option
            placeholder="请选择课堂"
            @change="changeSelect">
            <el-checkbox v-model="checkedAll" @change="clickCheckedAll">全选</el-checkbox>
            <el-option
              v-for="(item,index) in allClassroom"
              :key="index"
              :label="item.name"
              :value="item.ct_id"/>
          </el-select>
        </div>
      </div>
    </modal-dialog>
    <!-- 一键添加课堂成员弹出框end -->
  </div>
</template>

<script>
import ModalDialog from '@/components/modal-dialog'
import $ from '../../assets/jquery-vendor'
import BrokenLine from '@/components/broken-line'
import RingLing from '@/components/ring-ling'
import Gauge from '@/components/gauge'
import Pager from '@/components/pager'
import { baseUrl, confirm, toast, formVaildStyle, formInVaildStyle } from '@/utils/global'
export default {
  name: 'ClassroomMembers',
  filters: {
    filterIndex(value) {
      return value >= 10 ? value : '0' + value
    },
    // filterSex(value){
    //     return value === '1' ? '女' : '男';
    // },
    // 字符串截取省略
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 13) {
        return value.slice(0, 13) + '...'
      }
      return value
    }
  },
  components: {
    'ring-ling': RingLing,
    'modal-dialog': ModalDialog,
    'gauge': Gauge,
    'broken-line': BrokenLine,
    'pager': Pager
  },
  props: {
    classId: {
      type: String,
      default: ''
    },
    pkgId: {
      type: String,
      default: ''
    },
    isClassroomFinished: {
      type: Boolean,
      default: true
    },
    hasPermission: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 课堂成员操作权限
      permission: {
        hasCheckTraineePermission: false,
        hasDeleteTraineePermission: false,
        hasEditTraineePermission: false
      },
      // 小组成员操作权限
      groupPermission: {
        // 是否有添加小组成员的权限
        hasAddGmTraineePermission: false,
        // 是否添加小组的权限
        hasAddGroupPermission: false,
        // 是否有删除小组的权限
        hasDeleteGroupPermission: false,
        // 是否有重命名小组的权限
        hasRenameGroupPermission: false,
        // 是否有设置组长、项目经理等权限
        hasSetGmLeaderPermission: false,
        // 是否有 删除小组成员 的权限
        hasDeleteGmTraineePermission: false
      },
      tabIndex: 1, // 当前切换的课堂tab值
      isShowStatistics: false,
      isShowClassroomRembersMain: true, // 是否课堂成员主界面
      currentViewStudent: '', // 当前查看的学员
      isShowStartSingIn: false,
      handleSignInType: false,
      isShowImportCalssMembers: false,
      isShowGroupingManager: false,
      ctId: localStorage.getItem('ct_id'),
      listClassroomTrainee: [],
      empiricalValueInfo: [], // 当前学员经验值详情
      isClassroomPullDown: true,
      traineeName: '', // 输入的搜索班课成员名称
      classMemberName: '', // 输入班级成员名称
      groupRemberName: '', // 输入课堂小组成员名
      operationButton: false, // 是否显示小组成员操作按钮
      operationTraineeId: '', // 当前操作的学员id
      classroomGroupInfo: {}, // 当前选中的课堂分组
      classroomGroupEditName: '', // 当前分组重命名的名称
      classroomMemberNum: 0, // 班课成员数
      baseInfo: {},
      performanceInfo: {},
      traineeBaseInfo: {},
      listClassTrainee: [], // 班级成员
      selectListClassTrainee: [],
      selectnoJoinClassTrainee: [],
      selectDelGroupTrainee: [], // 已选择的 删除小组成员 列表
      isCheckAllNoJoinClassTrainee: false, // 是否全选
      isCheckAllDelGroupMemberTrainee: false, // 删除小组成员 是否全选
      isCheckAllAwaitAuditTrainee: false, // 待审核成员是否全选
      isCheckAllAwaitDelTrainee: false, // 移出课堂 成员是否全选
      pagerInfo: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSizeProp: 10, // 分页大小
        pageSize: 10// 分页大小
      },
      classroomMemberPager: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSize: 10// 分页大小
      },
      classroomGroupInfoPager: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSizeProp: 7, // 分页大小
        pageSize: 7// 分页大小
      },
      experienceValueInfoPager: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSizeProp: 5, // 分页大小
        pageSize: 5// 分页大小
      },
      noJoinClassTraineePager: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSizeProp: 40, // 分页大小
        pageSize: 40, // 分页大小
        traineeName: '',
        totalCount: 0
      },
      delGroupTraineePager: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSizeProp: 40, // 分页大小
        pageSize: 40, // 分页大小
        traineeName: '',
        dictCode: '',
        mobile: '',
        totalCount: 0
      },
      awaitAuditTraineePagerInfo: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSizeProp: 5, // 分页大小
        pageSize: 5, // 分页大小
        traineeName: '',
        totalCount: 0
      },
      awaitDelTraineePagerInfo: {
        currPage: 1, // 当前页
        totalPage: null, // 总页数
        pageSizeProp: 40, // 分页大小
        pageSize: 40, // 分页大小
        traineeName: '',
        mobile: '',
        totalCount: 0
      },
      awaitAuditTraineeList: [], // 待审核成员列表
      awaitDelTraineeList: [], // 移出课堂 所有 成员列表
      selectAwaitAuditTrainee: [], // 选中的待审核成员id
      selectAwaitDelTrainee: [], // 选中的移出课堂 成员id
      classMemberNum: 0, // 班级成员计数编号
      isCheckAll: false, // 是否全选
      classMemberNumPeople: 0, // 班级成员数量
      listClassroomGroupSimpleInfo: [], // 课堂小组列表
      viewClassroomGroupInfo: {}, // 课堂小组基本信息
      viewClassroomGroupMemberList: [], // 课堂小组成员列表
      currentClassMemberIndex: 0,
      groupName: '', // 新增的分组名称
      groupNameList: [{ groupName: '' }], // 新增分组的名称集合
      type: 1, // 类型 1表示进入导入课堂成员 2表示进入未加入课堂小组的成员
      listClassroomTraineeExcludeJoinedGroup: [], // 未加入课堂小组学员列表

      listDelGroupMember: [], // 当前小组学员列表  用于删除小组成员
      // 修改时的学生信息
      editTraineeInfo: {
        name: '',
        mobile: '',
        srcImg: '',
        sex: 0,
        nickName: ''
      },
      identityList: [], // 获取课堂小组成员身份列表 ，用于小组成员 设为 组长、开发人员、项目经理等 身份
      currEditTraineeInfo: {}, // 修改的学生信息
      traineeSexList: [{ id: '0', value: '保密' }, { id: '1', value: '男' }, { id: '2', value: '女' }], // 性别选择数据
      excludeJoinedGroupAll: [], // 未加入分组的所有课堂成员
      currSelectionClass: [], // 当前选中的课堂
      allClassroom: [], // 属于当前用户的所有课堂
      checkedAll: false, // 是否全选
      chartsDate: {
        meterDiagramInfo: { list: [{ name: '进度', value: 0 }] }
      }, // 图表的数据
      groupIsDelOrSetting: 'del' // 是 删除分组成员 还是 批量设置小组成员身份
    }
  },
  watch: {
    'listClassTrainee': function(nValue) {
      if (this.selectListClassTrainee.length > 0) {
        this.selectListClassTrainee.map(item => {
          nValue.map(newItem => {
            if (item.traineeId === newItem.traineeId) {
              newItem.isSelect = true
            }
          })
        })
      }
      if (nValue.length > 0) {
        const isexistNoSelect = nValue.filter(item => item.isSelect === false).length > 0
        if (isexistNoSelect) {
          this.isCheckAll = false
        } else {
          this.isCheckAll = true
        }
      }
    },
    'listClassroomTraineeExcludeJoinedGroup': function(nValue) {
      if (this.selectnoJoinClassTrainee.length > 0) {
        this.selectnoJoinClassTrainee.map(item => {
          nValue.map(newItem => {
            if (item === newItem.traineeId) {
              newItem.isSelect = true
            }
          })
        })
      }
      if (nValue.length > 0) {
        const isexistNoSelect = nValue.filter(item => item.isSelect === false).length > 0
        if (isexistNoSelect) {
          this.isCheckAllNoJoinClassTrainee = false
        } else {
          this.isCheckAllNoJoinClassTrainee = true
        }
      }
    },
    'listDelGroupMember': function(nValue) {
      if (this.selectDelGroupTrainee.length > 0) {
        this.selectDelGroupTrainee.map(item => {
          nValue.map(newItem => {
            if (item === newItem.gmId) {
              newItem.isSelect = true
            }
          })
        })
      }
      if (nValue.length > 0) {
        const isexistNoSelect = nValue.filter(item => item.isSelect === false).length > 0
        if (isexistNoSelect) {
          this.isCheckAllDelGroupMemberTrainee = false
        } else {
          this.isCheckAllDelGroupMemberTrainee = true
        }
      }
    },
    'awaitAuditTraineeList': function(nValue) {
      if (this.selectAwaitAuditTrainee.length > 0) {
        this.selectAwaitAuditTrainee.map(item => {
          nValue.map(newItem => {
            if (item === newItem.traineeId) {
              newItem.isSelect = true
            }
          })
        })
      }
      if (nValue.length > 0) {
        const isexistNoSelect = nValue.filter(item => item.isSelect === false).length > 0
        if (isexistNoSelect) {
          this.isCheckAllAwaitAuditTrainee = false
        } else {
          this.isCheckAllAwaitAuditTrainee = true
        }
      }
    },
    'awaitDelTraineeList': function(nValue) {
      if (this.selectAwaitDelTrainee.length > 0) {
        this.selectAwaitDelTrainee.map(item => {
          nValue.map(newItem => {
            if (item === newItem.id) {
              newItem.isSelect = true
            }
          })
        })
      }
      if (nValue.length > 0) {
        const isexistNoSelect = nValue.filter(item => item.isSelect === false).length > 0
        if (isexistNoSelect) {
          this.isCheckAllAwaitDelTrainee = false
        } else {
          this.isCheckAllAwaitDelTrainee = true
        }
      }
    }
  },
  mounted() {

  },
  created() {
    const that = this
    window.eventBus.$on('eventBusReceivedMsgData', function(data) {
      that.handleMessBackData(data)
    })
  },
  methods: {
    /** 小组里面 设置学员在小组里面的身份 */
    handleSettingGroupIdentity: function(command, gmId, type) {
      let formData = null
      let url = ''
      if (type && type === 'all') {
        // 判断是否选择了学员
        if (this.selectDelGroupTrainee.length <= 0) {
          toast('请选择成员')
          return
        }
        formData = {
          ctId: this.ctId,
          gmIds: this.selectDelGroupTrainee,
          dictCode: command
        }
        url = 'setIdentityBatch'
      } else {
        formData = new FormData()
        formData.append('ctId', this.ctId)
        formData.append('gmId', gmId)
        formData.append('dictCode', command)
        url = 'setIdentity'
      }

      if (url) {
        // 调用小组组长设置接口
        this.$api.classroomMember[url](formData).then(res => {
          if (res.code === 0) {
            // 关闭模态框
            $('#del-group-trainee-list').modal('hide')
            // 刷新小组数据
            this.getListClassroomGroupSimpleInfo()
            toast(((res.msg) ? (res.msg) : '设置成功'), () => { })
          } else {
            toast(res.msg)
          }
        })
      }
    },
    /** 页面初始数据的方法  */
    isShowPage: function() {
      // 获取所有课堂成员
      this.getListClassroomTrainee()
      // this.getListClassTrainee();
      // 查询所有待审核成员
      this.queryTraineeList()
    },
    /** 处理 返回的消息数据 */
    handleMessBackData: function(res) {
      const that = this
      if (res.busitypeIndexNew === 15) { // 有人申请加入我创建的课堂 用于刷新成员列表
        if (res.code === 0) {
          if (res.data && res.data.msg) {
            for (let i = 0; i < res.data.msg.length; i++) {
              if (res.data.msg[i].ctId && localStorage.getItem('ct_id') && (res.data.msg[i].ctId === localStorage.getItem('ct_id'))) {
                // 获取所有课堂成员
                that.getListClassroomTrainee()
                // this.getListClassTrainee();
                // 查询所有待审核成员
                that.queryTraineeList()
              }
            }
          }
        }
      }
    },
    // 调用显示课堂成员主界面
    tohandleshowRembersMain() {
      this.handleshowRembersMain()
    },
    // 头像上传成功
    handleAvatarSuccess(res, file) {
      this.editTraineeInfo.srcImg = URL.createObjectURL(file.raw)
    },
    // 头像上传限制
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 显示课堂成员主界面
    handleshowRembersMain() {
      this.isShowClassroomRembersMain = true
      this.isShowSignInMain = false
      this.isShowStartSingIn = false
      this.handleSignInType = false
      this.isShowStatistics = false
      this.isShowImportCalssMembers = false
      this.selectListClassTrainee = []
      this.isCheckAll = false
      this.isShowGroupingManager = false
    },
    // 显示签到主界面
    handleShowClassroomRembersMain() {
      this.isShowClassroomRembersMain = false
      this.isShowSignInMain = true
      this.isShowStartSingIn = false
      this.handleSignInType = true
      this.isShowStatistics = false
      this.isShowImportCalssMembers = false
      this.isShowGroupingManager = false
      this.isShowViewSignInSettlement = false
      this.getHistorySignInRecord()
    },

    // 显示分组管理
    handleShowGruopingManager() {
      // this.isShowClassroomRembersMain=false;
      // this.isShowGroupingManager=true;
      this.tabIndex = 2
      this.getIdentityList()
      this.getListClassroomGroupSimpleInfo()
      // 查询未分组成员
      this.getListClassroomTraineeExcludeJoinedGroup(true)
      this.queryTraineeList()
    },

    // 获取课堂小组成员身份 ，用于小组成员 设为 组长、开发人员、项目经理等 身份
    getIdentityList() {
      this.identityList = []
      this.$api.classroomMember.getIdentityList().then(res => {
        if (res.code === 0) {
          this.identityList = (res.data && res.data.length > 0) ? (res.data) : []
        }
      })
    },

    // 导入课堂成员
    handleImportClassroomMember() {
      this.getListClassTrainee()
      this.isShowClassroomRembersMain = false
      this.isShowSignInMain = false
      this.handleSignInType = false
      this.isShowStartSingIn = false
      this.isShowStatistics = false
      this.isShowImportCalssMembers = true
      this.isShowGroupingManager = false
    },

    // 操作按钮的显示与隐藏
    handleIsShowOperation(value) {
      if (this.operationButton && this.operationTraineeId === value) {
        this.operationButton = false
        this.operationTraineeId = ''
      } else {
        this.operationButton = true
        this.operationTraineeId = value
      }
    },

    // 设置小组组长
    handleAddGroupLeader(value) {
      // 创建调用小组组长设置接口提交参数对象
      const formData = new FormData()
      formData.append('gpId', value.gpId)
      formData.append('traineeId', value.traineeId)
      // 调用小组组长设置接口
      this.$api.classroomMember.setTraineeToLeader(formData).then(res => {
        if (res.code === 0) {
          // 刷新小组数据
          this.getListClassroomGroupSimpleInfo()
        }
        toast(res.msg)
      })
    },

    // 打开个人经验值明细模态框
    handleEmpiricalValueDetails(value) {
      this.currentViewStudent = value
      this.$refs.experience.changeExperienceModal('1100px')
      $('#empirical-value-details-dialog').modal('show')
      // 调用获取个人经验明细方法
      this.queryEmpiricalValue()
    },

    // 获取个人经验明细
    queryEmpiricalValue() {
      const obj = {
        ctId: this.ctId,
        traineeId: this.currentViewStudent,
        pageNum: this.experienceValueInfoPager.currPage,
        pageSize: this.experienceValueInfoPager.pageSize
      }
      // 调用学员经验值信息查询接口
      this.$api.classroomMember.viewEmpiricalValueLogs(obj).then(res => {
        if (res.code === 0) {
          // 存入当前学员的经验值详情
          this.empiricalValueInfo = res.data.list
          // 存入总页数
          this.experienceValueInfoPager.totalPage = res.data.totalPage
        }
      })
    },

    // 待审核的成员列表
    queryTraineeList() {
      // 清空待审核成员集合
      this.awaitAuditTraineeList = []
      // 创建接口调用的参数对象
      const obj = {
        ctId: this.ctId,
        traineeName: this.awaitAuditTraineePagerInfo.traineeName,
        pageNum: this.awaitAuditTraineePagerInfo.currPage,
        pageSize: this.awaitAuditTraineePagerInfo.pageSize
      }
      // 调用待审核成员查询接口
      this.$api.classroomMember.queryTraineeList(obj).then(res => {
        if (res.code === 0) {
          // 存入总页数
          this.awaitAuditTraineePagerInfo.totalPage = res.data.totalPage
          // 存入成员数量
          this.awaitAuditTraineePagerInfo.totalCount = res.data.totalCount
          // 存入学员信息
          if (res.data.totalCount > 0) {
            res.data.list.map(item => {
              item.isSelect = false
              // 处理成员头像
              if (item.traineePic.indexOf('http') === -1 && item.traineePic.indexOf('https') === -1) {
                item.traineePic = baseUrl + item.traineePic
              }
              this.awaitAuditTraineeList.push(item)
            })
          }
        }
      })
    },

    // 待审核成员更新分页数据
    changeAwaitAuditTraineeIndex(value, size) {
      this.awaitAuditTraineePagerInfo.currPage = value
      this.awaitAuditTraineePagerInfo.pageSize = size
      // 调用成员查询方法
      this.queryTraineeList()
    },

    // 移出课堂 成员更新分页数据
    changeAwaitDelTraineeIndex(value, size) {
      this.awaitDelTraineePagerInfo.currPage = value
      this.awaitDelTraineePagerInfo.pageSize = size
      // 调用成员查询方法
      this.queryAllTraineeList()
    },

    // 经验值显示更新分页数据
    changeExperienceValueIndex(value, size) {
      this.experienceValueInfoPager.currPage = value
      this.experienceValueInfoPager.pageSize = size
      // 调用经验值信息查询方法
      this.queryEmpiricalValue()
    },

    // 全选/取消全选待审核成员
    handleCheckAllAwaitAuditTrainee() {
      if (this.isCheckAllAwaitAuditTrainee) {
        this.isCheckAllAwaitAuditTrainee = false
        this.awaitAuditTraineeList.map(item => {
          item.isSelect = false
          for (let i = 0; i < this.selectAwaitAuditTrainee.length; i++) {
            if (item.traineeId === this.selectAwaitAuditTrainee[i]) {
              this.selectAwaitAuditTrainee.splice(i, 1)
              i--
            }
          }
        })
        // this.selectAwaitAuditTrainee=[];
      } else {
        this.isCheckAllAwaitAuditTrainee = true
        // this.selectAwaitAuditTrainee=[];
        this.awaitAuditTraineeList.map(item => {
          item.isSelect = true
          let temp = true
          for (let i = 0; i < this.selectAwaitAuditTrainee.length; i++) {
            if (this.selectAwaitAuditTrainee[i] === item.traineeId) {
              temp = false
            }
          }
          if (temp) {
            this.selectAwaitAuditTrainee.push(item.traineeId)
          }
        })
      }
    },

    // 全选/取消全选  移出课堂 成员
    handleCheckAllAwaitDelTrainee() {
      if (this.isCheckAllAwaitDelTrainee) {
        this.isCheckAllAwaitDelTrainee = false
        this.awaitDelTraineeList.map(item => {
          item.isSelect = false
          for (let i = 0; i < this.selectAwaitDelTrainee.length; i++) {
            if (item.id === this.selectAwaitDelTrainee[i]) {
              this.selectAwaitDelTrainee.splice(i, 1)
              i--
            }
          }
        })
        // this.selectAwaitDelTrainee=[];
      } else {
        this.isCheckAllAwaitDelTrainee = true
        // this.selectAwaitDelTrainee=[];
        this.awaitDelTraineeList.map(item => {
          item.isSelect = true
          let temp = true
          for (let i = 0; i < this.selectAwaitDelTrainee.length; i++) {
            if (this.selectAwaitDelTrainee[i] === item.id) {
              temp = false
            }
          }
          if (temp) {
            this.selectAwaitDelTrainee.push(item.id)
          }
        })
      }
    },

    // 是否通过审核
    handlePassAudit(isPass) {
      // 判断是否选择了学员
      if (this.selectAwaitAuditTrainee.length <= 0) {
        toast('请选择待审核成员')
        return
      }
      // 创建接口调用的参数对象
      const obj = {
        ctId: this.ctId,
        isPass: isPass,
        traineeIds: this.selectAwaitAuditTrainee
      }
      // 关闭审核模态框
      $('#await-audit-trainee-dialog').modal('hide')
      // 调用审核是否通过接口
      this.$api.classroomMember.setTraineeToClassroom(obj).then(res => {
        if (res.code === 0) {
          toast(res.msg, () => {
            // 获取所有课堂成员
            this.getListClassroomTrainee()
            // 清空待审核成员信息
            this.cancelAwaitAuditTrainee()
            // 待审核成员全选初始化
            this.isCheckAllAwaitAuditTrainee = false
          })
        } else {
          toast(res.msg)
        }
      })
    },

    // 是否批量 删除成员
    handleDelMembers() {
      // 判断是否选择了学员
      if (this.selectAwaitDelTrainee.length <= 0) {
        toast('请选择成员')
        return
      }
      // 将 批量删除 成员 弹窗 的 层级 降一层
      const indexm = $('body .modal-backdrop').length - 1
      $('#await-del-trainee-dialog').addClass('msgModalDel')
      $('body .modal-backdrop').eq(indexm).addClass('msgModalDelBackdrop')
      this.$forceUpdate()
      // 弹出 确定框
      confirm('您确定将选中的学员从课堂中移出吗', () => {
        // 创建接口调用的参数对象
        const obj = {
          ctId: this.ctId,
          ids: this.selectAwaitDelTrainee
        }
        // 关闭审核模态框
        // $("#await-del-trainee-dialog").modal('hide');
        // 调用审核是否通过接口
        this.$api.classroomMember.deleteClassroomTraineeBatch(obj).then(res => {
          if (res.code === 0) {
            // 获取所有课堂成员
            this.getListClassroomTrainee()
            // 清空待审核成员信息
            this.cancelAwaitDelTrainee()
            this.queryAllTraineeList()
            // 待审核成员全选初始化
            this.isCheckAllAwaitDelTrainee = false
            toast(res.msg, () => {

            })
          } else {
            toast(res.msg)
          }
        })
      })
      // 将 批量删除 成员 弹窗 的 层级 恢复
      $('#exampleModalCenter').on('hide.bs.modal', function() {
        $('#await-del-trainee-dialog').removeClass('msgModalDel')
        $('body .modal-backdrop').eq(indexm).removeClass('msgModalDelBackdrop')
      })
    },

    /**
             * 返回新的command对象
             */
    beforeHandleCommand(command, value) {
      const obj = {
        command: command,
        item: value
      }
      return obj
    },

    /**
             * 下拉菜单列表的事件触发
             */
    handleCommand(command) {
      if (command.command === 1) {
        this.handleGetApproved(command.item.traineeId, 'Y')
      } else if (command.command === 2) {
        this.handleGetApproved(command.item.traineeId, 'N')
      } else if (command.command === 3) {
        this.handleSetTeachingAssistant(command.item)
      } else if (command.command === 4) {
        this.showEditTraineeInfo(command.item)
      } else if (command.command === 5) {
        this.handleDleClassroomTrainee(command.item)
      }
    },

    // 课堂成员显示中是否通过审核事件
    handleGetApproved(item, isPass) {
      // 创建调用审核是否通过接口的参数对象
      const arr = []
      arr.push(item)
      const obj = {
        ctId: this.ctId,
        isPass: isPass,
        traineeIds: arr
      }
      // 调用审核是否通过接口
      this.$api.classroomMember.setTraineeToClassroom(obj).then(res => {
        if (res.code === 0) {
          toast(res.msg, () => {
            // 获取所有课堂成员
            this.getListClassroomTrainee()
            // 获取所有待审核成员
            this.queryTraineeList()
          })
        } else {
          toast(res.msg)
        }
      })
    },

    // 选中/取消待审核成员
    handleSelectAwaitAuditTrainee(awaitAuditTraine) {
      if (awaitAuditTraine.isSelect) {
        for (let i = 0; i < this.selectAwaitAuditTrainee.length; i++) {
          if (awaitAuditTraine.traineeId === this.selectAwaitAuditTrainee[i]) {
            this.selectAwaitAuditTrainee.splice(i, 1)
          }
        }
        awaitAuditTraine.isSelect = false
      } else {
        awaitAuditTraine.isSelect = true
        this.selectAwaitAuditTrainee.push(awaitAuditTraine.traineeId)
      }
      if (this.awaitAuditTraineeList.length > 0) {
        const isexistNoSelect = this.awaitAuditTraineeList.filter(item => item.isSelect === false).length > 0
        if (isexistNoSelect) {
          this.isCheckAllAwaitAuditTrainee = false
        } else {
          this.isCheckAllAwaitAuditTrainee = true
        }
      }
    },

    // 选中/取消 移出课堂 成员
    handleSelectAwaitDelTrainee(awaitDelTrainee) {
      if (awaitDelTrainee.isSelect) {
        for (let i = 0; i < this.selectAwaitDelTrainee.length; i++) {
          if (awaitDelTrainee.id === this.selectAwaitDelTrainee[i]) {
            this.selectAwaitDelTrainee.splice(i, 1)
          }
        }
        awaitDelTrainee.isSelect = false
      } else {
        awaitDelTrainee.isSelect = true
        this.selectAwaitDelTrainee.push(awaitDelTrainee.id)
      }
      if (this.awaitDelTraineeList.length > 0) {
        const isexistNoSelect = this.awaitDelTraineeList.filter(item => item.isSelect === false).length > 0
        if (isexistNoSelect) {
          this.isCheckAllAwaitDelTrainee = false
        } else {
          this.isCheckAllAwaitDelTrainee = true
        }
      }
    },

    // 待审核通过成员信息清空
    cancelAwaitAuditTrainee() {
      this.selectAwaitAuditTrainee = []
      this.awaitAuditTraineePagerInfo.traineeName = ''
    },
    // 移出课堂  成员信息清空
    cancelAwaitDelTrainee() {
      this.selectAwaitDelTrainee = []
      this.awaitDelTraineePagerInfo.traineeName = ''
      this.awaitDelTraineePagerInfo.mobile = ''
    },

    // 搜索待审核通过成员
    handleSearchAwaitAuditTraineePagerInfoName() {
      this.queryTraineeList()
    },

    // 搜索 移出课堂 成员
    handleSearchAwaitDelTraineePagerInfoName() {
      this.queryAllTraineeList()
    },

    // 显示待审核列表成员弹窗
    handleShowAwaitAuditDialog() {
      this.queryTraineeList()
      this.$refs.awaitAuditTraineeDialog.changeExperienceModal()
      $('#await-audit-trainee-dialog').modal('show')
    },

    // 显示  移出课堂  成员弹窗
    handleShowAwaitDelDialog() {
      this.queryAllTraineeList()
      this.$refs.awaitDelTraineeDialog.changeDelMemberModal()
      $('#await-del-trainee-dialog').modal('show')
    },

    // 显示  移出课堂  成员弹窗
    queryAllTraineeList() {
      // 清空 移出课堂 所有 成员列表
      this.awaitDelTraineeList = []
      // 创建接口调用的参数对象
      const obj = {
        ctId: this.ctId,
        traineeName: this.awaitDelTraineePagerInfo.traineeName,
        mobile: this.awaitDelTraineePagerInfo.mobile,
        pageNum: this.awaitDelTraineePagerInfo.currPage,
        pageSize: this.awaitDelTraineePagerInfo.pageSize
      }
      // 调用待审核成员查询接口
      this.$api.classroomMember.listClassroomTrainee(obj).then(res => {
        if (res.code === 0) {
          this.awaitDelTraineeList = []
          // 存入总页数
          this.awaitDelTraineePagerInfo.totalPage = res.data.totalPage
          // 存入成员数量
          this.awaitDelTraineePagerInfo.totalCount = res.data.totalCount
          // 存入学员信息
          if (res.data.totalCount > 0) {
            res.data.list.map(item => {
              // if (item.state &&  item.state =='Y') {
              item.isSelect = false
              // 处理成员头像
              if (item.traineePic && item.traineePic.indexOf('http') === -1 && item.traineePic.indexOf('https') === -1) {
                item.traineePic = baseUrl + item.traineePic
              }
              this.awaitDelTraineeList.push(item)

              // } else {
              //     this.awaitDelTraineePagerInfo.totalCount= this.awaitDelTraineePagerInfo.totalCount= -1;
              // }
            })
          }
        }
      })
    },

    // 显示未加入课堂小组成员列表弹窗
    handleShowAddGroupDialog() {
      if (this.listClassroomGroupSimpleInfo.length <= 0) {
        toast('暂无任何分组，无法添加成员')
        return
      }
      this.$refs.noJoinClassGroupTraineeList.changeDelMemberModal()
      $('#no-join-class-group-trainee-list').modal('show')

      this.getListClassroomTraineeExcludeJoinedGroup()
    },

    // 显示 批量删除小组成员 列表弹窗
    handleShowDelGroupMemberDialog(type) {
      this.groupIsDelOrSetting = type
      if (this.viewClassroomGroupMemberList.length <= 0) {
        const msg = (this.groupIsDelOrSetting && this.groupIsDelOrSetting === 'setting') ? '当前分组暂无成员，无法设置成员的身份' : '当前分组暂无成员，无法删除成员'
        toast(msg)
        return
      }
      this.$refs.delGroupTraineeList.changeDelMemberModal()
      $('#del-group-trainee-list').modal('show')

      this.isCheckAllDelGroupMemberTrainee = false
      this.getListDelGroupMember()
    },

    // 当前 小组的成员列表 删除小组成员
    getListDelGroupMember() {
      this.listDelGroupMember = []

      // this.excludeJoinedGroupAll = [];
      // this.viewClassroomGroupMemberList = [];

      // 创建调用获取课堂小组信息接口的参数对象
      const obj = {
        gpId: this.viewClassroomGroupInfo.gpId,
        traineeName: this.delGroupTraineePager.traineeName,
        pageNum: this.delGroupTraineePager.currPage,
        pageSize: this.delGroupTraineePager.pageSize,
        dictCode: this.delGroupTraineePager.dictCode,
        mobile: this.delGroupTraineePager.mobile
      }
      // 调用获取课堂小组信息接口
      this.$api.classroomMember.viewClassroomGroupInfo(obj).then(res => {
        if (res.code === 0) {
          this.listDelGroupMember = []

          this.delGroupTraineePager.totalCount = res.data.totalCount
          this.delGroupTraineePager.totalPage = res.data.totalPage

          // 图片信息处理
          res.data.list.map(item => {
            item.isSelect = false
            if (item.traineePic.indexOf('http') === -1) {
              item.traineePic = baseUrl + item.traineePic
            }
          })
          this.listDelGroupMember = res.data.list
        }
      })
    },

    // 删除小组成员 列表更新分页数据
    changeDelGroupMemberTraineeIndex(value, size) {
      this.delGroupTraineePager.currPage = value
      this.delGroupTraineePager.pageSize = size
      this.getListDelGroupMember()
    },

    // 选中/取消 删除小组成员
    handleSelectDelGroupMemberTrainee(delGroupTrainee) {
      if (delGroupTrainee.isSelect) {
        for (let i = 0; i < this.selectDelGroupTrainee.length; i++) {
          if (delGroupTrainee.gmId === this.selectDelGroupTrainee[i]) {
            this.selectDelGroupTrainee.splice(i, 1)
          }
        }
        delGroupTrainee.isSelect = false
      } else {
        delGroupTrainee.isSelect = true
        this.selectDelGroupTrainee.push(delGroupTrainee.gmId)
      }
      if (this.listDelGroupMember.length > 0) {
        const isexistNoSelect = this.listDelGroupMember.filter(item => item.isSelect === false).length > 0
        if (isexistNoSelect) {
          this.isCheckAllDelGroupMemberTrainee = false
        } else {
          this.isCheckAllDelGroupMemberTrainee = true
        }
      }
    },

    // 全选/取消全选  删除小组成员
    handleCheckAllDelGroupMemberTrainee() {
      if (this.isCheckAllDelGroupMemberTrainee) {
        this.isCheckAllDelGroupMemberTrainee = false
        this.listDelGroupMember.map(item => {
          item.isSelect = false
          for (let i = 0; i < this.selectDelGroupTrainee.length; i++) {
            if (this.selectDelGroupTrainee[i] === item.gmId) {
              this.selectDelGroupTrainee.splice(i, 1)
              i--
            }
          }
        })
      } else {
        this.isCheckAllDelGroupMemberTrainee = true
        this.listDelGroupMember.map(item => {
          item.isSelect = true
          let temp = true
          for (let i = 0; i < this.selectDelGroupTrainee.length; i++) {
            if (this.selectDelGroupTrainee[i] === item.gmId) {
              temp = false
            }
          }
          if (temp) {
            this.selectDelGroupTrainee.push(item.gmId)
          }
        })
      }
    },

    // 是否批量 删除小组成员
    handleDelGroupMembers() {
      // 判断是否选择了学员
      if (this.selectDelGroupTrainee.length <= 0) {
        toast('请选择成员')
        return
      }
      // 将 批量删除 成员 弹窗 的 层级 降一层
      const indexm = $('body .modal-backdrop').length - 1
      $('#del-group-trainee-list').addClass('msgModalDel')
      $('body .modal-backdrop').eq(indexm).addClass('msgModalDelBackdrop')
      this.$forceUpdate()
      // 弹出 确定框
      confirm('您确定将选中的学员从该小组中删除吗', () => {
        // 创建接口调用的参数对象
        const obj = {
          gpId: this.viewClassroomGroupInfo.gpId,
          gmIds: this.selectDelGroupTrainee
        }
        // 关闭模态框
        // $("#del-group-trainee-list").modal('hide');
        // 调用接口
        this.$api.classroomMember.removeGroupMembers(obj).then(res => {
          if (res.code === 0) {
            // 更新 批量删除 小组成员列表
            this.getListDelGroupMember()
            this.getListClassroomGroupSimpleInfo()

            // 清空成员信息
            this.cancelDelGroupTrainee()
            // 全选初始化
            this.isCheckAllDelGroupMemberTrainee = false

            toast(((res.msg) ? (res.msg) : '删除小组成员成功'), () => {

            })
          } else {
            toast(res.msg)
          }
        })
      })
      // 将 批量删除 成员 弹窗 的 层级 恢复
      $('#exampleModalCenter').on('hide.bs.modal', function() {
        $('#del-group-trainee-list').removeClass('msgModalDel')
        $('body .modal-backdrop').eq(indexm).removeClass('msgModalDelBackdrop')
      })
    },

    // 新增课堂小组验证
    addGroupFormValidity() {
      for (let i = 0; i < this.groupNameList.length; i++) {
        if (!this.groupNameList[i].groupName) {
          formInVaildStyle('', '#groupName' + i)
          $('#groupName' + i).focus()
          return false
        }
        formVaildStyle('', '#groupName' + i)
      }
      return true
    },

    // 显示添加分组弹窗
    handleIsShowAddGroup() {
      $('#add-classroom-group').modal('show')
    },

    // 重命名分组弹窗
    handleIsShowEditGroup() {
      this.classroomGroupEditName = this.classroomGroupInfo.groupName
      $('#edit-classroom-group').modal('show')
    },

    // 删除新建分组时的数据
    delGroupInput(index) {
      this.groupNameList.splice(index, 1)
    },

    // 添加分组的输入框
    addGroupInput() {
      this.groupNameList.push({ groupName: '' })
    },

    // 提交添加分组
    handleAddGroupSubmit() {
      if (this.addGroupFormValidity()) {
        const tempList = []
        for (let i = 0; i < this.groupNameList.length; i++) {
          tempList.push(this.groupNameList[i].groupName)
        }
        const obj = {
          ctId: this.ctId,
          list: tempList
        }
        this.$api.classroomMember.saveGroupInfo(obj).then((res) => {
          if (res.code === 0) {
            $('#add-classroom-group').modal('hide')
            /* toast(res.msg, ()=> {
                                this.getListClassroomGroupSimpleInfo();
                                this.groupName='';
                                this.groupNameList = [{groupName:""}];
                            })*/
            toast(res.msg)
            this.getListClassroomGroupSimpleInfo()
            this.groupName = ''
            this.groupNameList = [{ groupName: '' }]
          } else {
            toast(res.msg)
            this.groupNameList = [{ groupName: '' }]
          }
        })
      }
    },

    // 取消添加分组
    handleAddGroupCancel() {
      $('#add-classroom-group').modal('hide')
      this.groupName = ''
      this.groupNameList = [{ groupName: '' }]
    },

    // 提交重命名分组
    handleEditGroupSubmit() {
      if (!this.classroomGroupEditName) {
        formInVaildStyle('', '#optionName')
        $('#optionName').focus()
        return false
      }
      formVaildStyle('', '#optionName')
      this.clearValidate()
      $('#edit-classroom-group').modal('hide')
      const formData = new FormData()
      formData.append('gpId', this.classroomGroupInfo.gpId)
      formData.append('name', this.classroomGroupEditName)
      this.$api.classroomMember.rename(formData).then(res => {
        if (res.code === 0) {
          this.getListClassroomGroupSimpleInfo()
        }
        toast(res.msg)
      })
    },

    // 清空验证样式
    clearValidate() {
      $('.cb-form-valid').removeClass('cb-form-valid')
      $('.cb-form-invalid').removeClass('cb-form-invalid')
      $('.invalid-feedback').css('display', 'none')
    },

    // 取消提交重命名分组
    handleEditGroupCancel() {
      $('#edit-classroom-group').modal('hide')
    },

    // 添加课堂小组成员
    addClassGroupTrainee() {
      if (this.selectnoJoinClassTrainee.length <= 0) {
        toast('请选择要添加的成员')
        return
      }
      const obj = {
        ctId: this.ctId,
        gpId: this.viewClassroomGroupInfo.gpId,
        traineeIds: this.selectnoJoinClassTrainee
      }
      this.$api.classroomMember.setTraineeToGroup(obj).then(res => {
        if (res.code === 0) {
          $('#no-join-class-group-trainee-list').modal('hide')
          toast(res.msg)
          this.getListClassroomGroupSimpleInfo()
          this.noJoinClassTraineePager.traineeName = ''
          this.noJoinClassTraineePager.currPage = 1
          this.selectnoJoinClassTrainee = []
        } else {
          toast(res.msg)
        }
      })
    },

    // 关闭未加入课堂小组成员弹窗
    cancelAddClassGroupTrainee() {
      this.selectnoJoinClassTrainee = []
      this.noJoinClassTraineePager.traineeName = ''
      this.getListClassroomTraineeExcludeJoinedGroup(true)
    },

    // 关闭删除 小组成员弹窗
    cancelDelGroupTrainee() {
      this.selectDelGroupTrainee = []
      this.delGroupTraineePager.traineeName = ''
      this.getListClassroomTraineeExcludeJoinedGroup(true)
      this.getViewClassroomGroupInfo(this.viewClassroomGroupInfo.gpId)
    },

    // 全选/取消全选未加入课堂小组成员
    handleCheckAllNoJoinClassTrainee() {
      if (this.isCheckAllNoJoinClassTrainee) {
        this.isCheckAllNoJoinClassTrainee = false
        this.listClassroomTraineeExcludeJoinedGroup.map(item => {
          item.isSelect = false
          for (let i = 0; i < this.selectnoJoinClassTrainee.length; i++) {
            if (this.selectnoJoinClassTrainee[i] === item.traineeId) {
              this.selectnoJoinClassTrainee.splice(i, 1)
              i--
            }
          }
        })
      } else {
        this.isCheckAllNoJoinClassTrainee = true
        this.listClassroomTraineeExcludeJoinedGroup.map(item => {
          item.isSelect = true
          let temp = true
          for (let i = 0; i < this.selectnoJoinClassTrainee.length; i++) {
            if (this.selectnoJoinClassTrainee[i] === item.traineeId) {
              temp = false
            }
          }
          if (temp) {
            this.selectnoJoinClassTrainee.push(item.traineeId)
          }
        })
      }
    },

    // 选中/取消未加入课堂小组成员
    handleSelectNoJoinTrainee(noJoinTrainee, index) {
      if (noJoinTrainee.isSelect) {
        for (let i = 0; i < this.selectnoJoinClassTrainee.length; i++) {
          if (noJoinTrainee.traineeId === this.selectnoJoinClassTrainee[i]) {
            this.selectnoJoinClassTrainee.splice(i, 1)
          }
        }
        noJoinTrainee.isSelect = false
      } else {
        noJoinTrainee.isSelect = true
        this.selectnoJoinClassTrainee.push(noJoinTrainee.traineeId)
      }
      if (this.listClassroomTraineeExcludeJoinedGroup.length > 0) {
        const isexistNoSelect = this.listClassroomTraineeExcludeJoinedGroup.filter(item => item.isSelect === false).length > 0
        if (isexistNoSelect) {
          this.isCheckAllNoJoinClassTrainee = false
        } else {
          this.isCheckAllNoJoinClassTrainee = true
        }
      }
    },

    // 未加入课堂学员列表更新分页数据
    changeNoJoinClassTraineeIndex(value, size) {
      this.noJoinClassTraineePager.currPage = value
      this.noJoinClassTraineePager.pageSize = size
      this.getListClassroomTraineeExcludeJoinedGroup()
    },

    // 搜索未加入课堂学员
    handleSearchNoJoinClassTraineeName() {
      this.noJoinClassTraineePager.currPage = 1
      this.getListClassroomTraineeExcludeJoinedGroup()
    },

    // 搜索删除小组学员列表
    handleSearchDelGroupMemberTraineeName() {
      this.delGroupTraineePager.currPage = 1
      this.getListDelGroupMember()
    },

    // 未加入课堂小组的成员列表
    getListClassroomTraineeExcludeJoinedGroup(value) {
      this.listClassroomTraineeExcludeJoinedGroup = []
      this.excludeJoinedGroupAll = []
      const obj = {
        ctId: this.ctId,
        gpId: this.viewClassroomGroupInfo.gpId,
        traineeName: this.noJoinClassTraineePager.traineeName,
        pageNum: this.noJoinClassTraineePager.currPage,
        pageSize: this.noJoinClassTraineePager.pageSize
      }
      if (value) {
        obj.withOutPage = 'Y'
      }
      this.$api.classroomMember.listClassroomTraineeExcludeJoinedGroup(obj).then(res => {
        if (res.code === 0) {
          this.listClassroomTraineeExcludeJoinedGroup = []
          this.noJoinClassTraineePager.totalCount = res.data.totalCount
          this.noJoinClassTraineePager.totalPage = res.data.totalPage
          if (!value && res.data.totalCount > 0) {
            for (let i = 0; i < res.data.list.length; i++) {
              res.data.list[i].isSelect = false
              const traineePic = res.data.list[i].traineePic
              if (traineePic.indexOf('http') === -1) {
                res.data.list[i].traineePic = baseUrl + traineePic
              }
              this.listClassroomTraineeExcludeJoinedGroup.push(res.data.list[i])
            }
          } else if (value) {
            this.excludeJoinedGroupAll = []
            for (let i = 0; i < res.data.length; i++) {
              const traineePic = res.data[i].traineePic
              if (traineePic.indexOf('http') === -1) {
                res.data[i].traineePic = baseUrl + traineePic
              }
            }
            this.excludeJoinedGroupAll = res.data
          }
        }
      })
    },

    // 课堂小组列表
    getListClassroomGroupSimpleInfo() {
      this.$api.classroomMember.listClassroomGroupSimpleInfo(this.ctId).then(res => {
        if (res.code === 0) {
          this.groupPermission = res.license
          if (res.data.length > 0) {
            this.classroomGroupInfo = res.data[this.currentClassMemberIndex]
            this.getViewClassroomGroupInfo(res.data[this.currentClassMemberIndex].gpId)
            this.listClassroomGroupSimpleInfo = res.data
          } else {
            this.listClassroomGroupSimpleInfo = []
            this.classroomGroupInfoPager = {
              currPage: 1, // 当前页
              totalPage: null, // 总页数
              pageSize: 5 // 分页大小
            }
            this.viewClassroomGroupMemberList = []
          }
        }
      })
    },

    // 移除小组成员
    handleRemoveGroupRember(classroomGroupMember) {
      const obj = {
        gmId: classroomGroupMember.gmId
      }
      confirm('您确定将【' + classroomGroupMember.traineeName + '】从' + this.viewClassroomGroupInfo.groupName + '分组中移除吗', () => {
        // 调用小组成员删除接口
        this.$api.classroomMember.deleteClassroomGroupMember(obj).then(res => {
          if (res.code === 0) {
            toast('移除成功', () => {
              // 刷新课堂小组信息
              this.getListClassroomGroupSimpleInfo()
              this.getListClassroomTraineeExcludeJoinedGroup(true)
            })
          } else {
            toast(res.msg)
          }
        })
      })
    },

    // 删除课堂成员分组
    handleRemoveGroup() {
      confirm('您确定要删除当前分组吗', () => {
        const formData = new FormData()
        // 存入当前分组id
        formData.append('gpId', this.classroomGroupInfo.gpId)
        // 调用删除分组接口
        this.$api.classroomMember.deleteClassroomGroup(formData).then(res => {
          if (res.code === 0) {
            // 刷新课堂小组信息
            this.currentClassMemberIndex = 0
            this.getListClassroomGroupSimpleInfo()
            this.getListClassroomTraineeExcludeJoinedGroup(true)
          }
          toast(res.msg)
        })
      })
    },

    // 课堂小组信息更新分页数据
    changeClassroomGroupInfoPagerIndex(value, size) {
      this.classroomGroupInfoPager.currPage = value
      this.classroomGroupInfoPager.pageSize = size
      this.getViewClassroomGroupInfo(this.viewClassroomGroupInfo.gpId)
    },

    handleSearchGroupRemberName() {
      this.classroomGroupInfoPager.currPage = 1
      this.getViewClassroomGroupInfo(this.viewClassroomGroupInfo.gpId)
    },

    handleViewClassroomGroupInfo(classroomGroupSimpleInfo, index) {
      this.classroomGroupInfo = classroomGroupSimpleInfo
      this.getViewClassroomGroupInfo(classroomGroupSimpleInfo.gpId)
      this.currentClassMemberIndex = index
    },

    // 查看课堂小组信息
    getViewClassroomGroupInfo(gpId) {
      // 创建调用获取课堂小组信息接口的参数对象
      const obj = {
        gpId: gpId,
        traineeName: this.groupRemberName,
        pageNum: this.classroomGroupInfoPager.currPage,
        pageSize: this.classroomGroupInfoPager.pageSize
      }
      // 调用获取课堂小组信息接口
      this.$api.classroomMember.viewClassroomGroupInfo(obj).then(res => {
        if (res.code === 0) {
          this.classroomGroupInfoPager.totalPage = res.data.totalPage
          this.viewClassroomGroupInfo = res.baseInfo
          // 图片信息处理
          res.data.list.map(item => {
            if (item.traineePic.indexOf('http') === -1) {
              item.traineePic = baseUrl + item.traineePic
            }
          })
          this.viewClassroomGroupMemberList = res.data.list
        }
      })
    },

    // 全选/取消全选
    handleCheckAll() {
      if (this.isCheckAll) {
        this.isCheckAll = false
        this.listClassTrainee.map(item => {
          item.isSelect = false
        })
        this.selectListClassTrainee = []
      } else {
        this.isCheckAll = true
        this.selectListClassTrainee = []
        this.listClassTrainee.map(item => {
          item.isSelect = true
          this.selectListClassTrainee.push(item)
        })
      }
    },

    // 搜索
    handleSearchClassMember() {
      this.getListClassTrainee()
    },

    // 显示/关闭课堂成员操作
    showClassroomMember: function(e, index) {
      const documentHeight = document.documentElement.clientHeight // 获取页面的高度
      const moreActionIconTop = e.target.getBoundingClientRect().y// 获取你点击时候的高度
      const dropdownHeight = $('#classroomMember').outerHeight()
      if ((documentHeight - moreActionIconTop) < (dropdownHeight + 30)) {
        this.isClassroomPullDown = false
      } else {
        this.isClassroomPullDown = true
      }
      for (let i = 0; i < this.listClassroomTrainee.length; i++) {
        if (i !== index) {
          $('.classroomMember' + i).css('display', 'none')
        }
      }
      if ($('.classroomMember' + index).css('display') === 'block') {
        $('.classroomMember' + index).css('display', 'none')
      } else {
        $('.classroomMember').css('display', 'none')
        $('.classroomMember' + index).css('display', 'block')
      }
    },

    // 搜索成员
    handleSearchTraineeName() {
      this.classroomMemberPager.currPage = 1
      this.getListClassroomTrainee()
    },

    // 查看成员基本信息
    handleViewTraineeBaseInfo(classroomTrainee) {
      this.chartsDate = {
        meterDiagramInfo: { list: [{ name: '进度', value: 0 }] }
      }
      this.currentViewStudent = classroomTrainee.traineeId
      const obj = {
        ctId: classroomTrainee.ctId,
        traineeId: classroomTrainee.traineeId
      }
      // 调用成员信息查看接口
      this.$api.classroomMember.viewTraineeBaseInfo(obj).then(res => {
        if (res.code === 0) {
          // 图片信息处理
          if (res.data.baseInfo.traineePic.indexOf('http') === -1) {
            res.data.baseInfo.traineePic = baseUrl + res.data.baseInfo.traineePic
          }
          this.traineeBaseInfo = res.data
          this.baseInfo = res.data.baseInfo
          this.performanceInfo = res.data.performanceInfo
        }
      })

      // 图像详细信息
      this.$api.classroomMember.viewTraineeDetailInfo(obj).then(res => {
        if (res.code === 0) {
          this.chartsDate = res.data
          this.$forceUpdate()
          // this.chartsDate.attendanceRateInfo.list[0].value = 10
        }
      })
      // this.viewNums(classroomTrainee);
    },

    // 分页更新数据
    changeIndex(value, size) {
      this.pagerInfo.currPage = value
      this.pagerInfo.pageSize = size
      this.getListClassTrainee()
    },

    // 选中/取消班级成员
    handleSelectClassTrainee(classTrainee, index) {
      if (classTrainee.isSelect) {
        for (let i = 0; i < this.selectListClassTrainee.length; i++) {
          if (classTrainee.num === this.selectListClassTrainee[i].num) {
            this.selectListClassTrainee.splice(i, 1)
          }
        }
        classTrainee.isSelect = false
      } else {
        classTrainee.isSelect = true
        this.selectListClassTrainee.push(classTrainee)
      }
      if (this.listClassTrainee.length > 0) {
        const isexistNoSelect = this.listClassTrainee.filter(item => item.isSelect === false).length > 0
        if (isexistNoSelect) {
          this.isCheckAll = false
        } else {
          this.isCheckAll = true
        }
      }
    },

    // 将班级学员导入成课堂成员
    handleImportTraineeBatch() {
      if (this.selectListClassTrainee.length <= 0) {
        toast('请选择要导入成员')
        return
      }
      const traineeIds = []
      this.selectListClassTrainee.map(item => {
        traineeIds.push(item.traineeId)
      })
      const obj = {
        ctId: this.ctId,
        classId: this.classId,
        traineeIds: traineeIds

      }
      confirm('您确定将选择的班级成员导出为课堂成员吗', () => {
        this.$api.classroomMember.importTraineeBatch(obj).then(res => {
          if (res.code === 0) {
            toast(res.msg, () => {
              this.getListClassroomTrainee()
              this.handleshowRembersMain()
            })
          } else {
            toast(res.msg)
          }
        })
      })
    },

    // 班级成员列表
    getListClassTrainee() {
      this.isCheckAll = false
      const obj = {
        ctId: this.ctId,
        classId: this.classId,
        traineeName: this.classMemberName,
        pageNum: this.pagerInfo.currPage,
        pageSize: this.pagerInfo.pageSize
      }
      this.listClassTrainee = []
      this.$api.classroomMember.listClassTrainee(obj).then(res => {
        if (res.code === 0) {
          if (res.data.currPage < 2) {
            this.classMemberNum = 0
          }
          this.pagerInfo.totalPage = res.data.totalPage
          this.classMemberNumPeople = res.data.totalCount
          if (res.data.totalCount > 0) {
            for (let i = 0; i < res.data.list.length; i++) {
              res.data.list[i].isSelect = false
              this.classMemberNum = this.classMemberNum + 1
              res.data.list[i].num = this.classMemberNum
              const traineePic = res.data.list[i].traineePic
              if (traineePic.indexOf('http') === -1) {
                res.data.list[i].traineePic = baseUrl + traineePic
              }
              this.listClassTrainee.push(res.data.list[i])
            }
          }
        }
      })
    },

    // 设置成员为助教
    handleSetTeachingAssistant(classroomTrainee) {
      // 如果是助教，则取消助教
      if (classroomTrainee.ifTa) {
        this.cancelTa(classroomTrainee)
        return false
      }
      const formData = new FormData()
      formData.append('ctId', classroomTrainee.ctId)
      formData.append('traineeId', classroomTrainee.traineeId)
      confirm('您确定设置【' + classroomTrainee.traineeName + '】为助教吗', () => {
        this.$api.classroomMember.setTraineeToTeachingAssistant(formData).then(res => {
          if (res.code === 0) {
            toast(res.msg)
            this.getListClassroomTrainee()
            this.$parent.viewPkgInfo()
          } else {
            toast(res.msg)
          }
        })
      })
    },
    cancelTa(classroomTrainee) {
      const formData = new FormData()
      formData.append('ctId', classroomTrainee.ctId)
      formData.append('traineeId', classroomTrainee.traineeId)
      confirm('您确定取消【' + classroomTrainee.traineeName + '】的助教吗', () => {
        this.$api.classroomMember.cancelTeachingAssistant(formData).then(res => {
          if (res.code === 0) {
            toast(res.msg)
            this.getListClassroomTrainee()
            this.$parent.viewPkgInfo()
          } else {
            toast(res.msg)
          }
        })
      })
    },

    // 打开编辑课堂成员弹出框
    showEditTraineeInfo(value) {
      this.currEditTraineeInfo = value
      this.editTraineeInfo.name = value.traineeName
      this.editTraineeInfo.nickName = value.nickName
      this.editTraineeInfo.mobile = value.mobile
      this.editTraineeInfo.srcImg = value.traineePic
      value.traineeSex ? this.editTraineeInfo.sex = value.traineeSex : this.editTraineeInfo.sex = 0
      $('#edit-trainee-info').modal('show')
    },
    // 关闭编辑课堂成员弹出框
    cancelEditTraineeInfo() {
      $('#edit-trainee-info').modal('hide')
    },
    // 点击上传图片
    changeImage(params) {
      this.editTraineeInfo.file = params.file
      const reader = new FileReader()
      const that = this
      reader.readAsDataURL(this.editTraineeInfo.file)
      reader.onload = function(e) {
        that.editTraineeInfo.srcImg = this.result
      }
    },
    // 编辑课堂成员
    handleEditTraineeInfo() {
      if (!this.editTraineeInfo.name || this.editTraineeInfo.name.trim === '') {
        formInVaildStyle('', '#traineeName')
        $('#traineeName').focus()
        return false
      }
      formVaildStyle('', '#traineeName')
      if (!this.editTraineeInfo.nickName || this.editTraineeInfo.nickName.trim === '') {
        formInVaildStyle('', '#nickName')
        $('#nickName').focus()
        return false
      }
      formVaildStyle('', '#nickName')
      // if (!this.editTraineeInfo.mobile || this.editTraineeInfo.mobile.trim === '') {
      //     formInVaildStyle('',"#traineeMobile");
      //     $("#traineeMobile").focus();
      //     return false;
      // }else if(this.editTraineeInfo.mobile!=="" && !(/^1[3456789]\d{9}$/.test(this.editTraineeInfo.mobile))){
      //     formInVaildStyle('.pkgTraineeMobileHint',"#traineeMobile");
      //     $("#traineeMobile").focus();
      //     return false;
      // }
      // formVaildStyle('.pkgTraineeMobileHint',"#traineeMobile");

      this.clearValidate()
      this.cancelEditTraineeInfo()
      // let obj = {
      //     ctId : this.ctId,
      //     file: this.editTraineeInfo.file,
      //     traineeId: this.currentViewStudent.traineeId,
      //     traineeSex: this.editTraineeInfo.sex,
      //     traineeName: this.editTraineeInfo.name,
      // }
      const formData = new FormData()
      formData.append('ctId', this.ctId)
      if (this.editTraineeInfo.file) {
        formData.append('file', this.editTraineeInfo.file)
      }
      formData.append('traineeId', this.currEditTraineeInfo.traineeId)
      formData.append('traineeSex', this.editTraineeInfo.sex)
      formData.append('traineeName', this.editTraineeInfo.name)
      formData.append('nickName', this.editTraineeInfo.nickName)

      this.$api.classroomMember.updateTraineeInfo(formData).then(res => {
        if (res.code === 0) {
          this.editTraineeInfo.file = null
          this.getListClassroomTrainee()
        }
        toast(res.msg)
      })
    },

    // 删除课堂成员
    handleDleClassroomTrainee(classroomTrainee) {
      const formData = new FormData()
      formData.append('ctId', classroomTrainee.ctId)
      formData.append('traineeId', classroomTrainee.traineeId)
      formData.append('id', classroomTrainee.id)
      confirm('您确定把【' + classroomTrainee.traineeName + '】从课堂中移除吗', () => {
        this.$api.classroomMember.deleteClassTrainee(formData).then(res => {
          if (res.code === 0) {
            toast(res.msg, () => {
              this.getListClassroomTrainee()
              // 刷新上方助教信息
              this.$parent.viewPkgInfo()
            })
          } else {
            toast(res.msg)
          }
        })
      })
    },

    // 课堂成员翻页
    // value为true意思为向下翻页，否则向上
    classroomMemberTurnPage(value) {
      if (value) {
        if (this.classroomMemberPager.currPage !== this.classroomMemberPager.totalPage) {
          this.classroomMemberPager.currPage = this.classroomMemberPager.currPage + 1
        }
      } else {
        if (this.classroomMemberPager.currPage !== 1) {
          this.classroomMemberPager.currPage = this.classroomMemberPager.currPage - 1
        }
      }
      this.getListClassroomTrainee()
    },

    // 获取课堂成员
    getListClassroomTrainee() {
      const obj = {
        ctId: this.ctId,
        traineeName: this.traineeName,
        pageNum: this.classroomMemberPager.currPage,
        pageSize: this.classroomMemberPager.pageSize
      }
      this.$api.classroomMember.listClassroomTrainee(obj).then(res => {
        if (res.code === 0) {
          this.listClassroomTrainee = []
          this.permission = res.license
          if (res.data.totalCount > 0) {
            this.classroomMemberNum = res.data.totalCount
            res.data.list.map(item => {
              if (item.traineePic.indexOf('http') === -1) {
                item.traineePic = baseUrl + item.traineePic
              }
              this.listClassroomTrainee.push(item)
            })
            this.classroomMemberPager.totalPage = res.data.totalPage
            this.$parent.setClassroomStudentNum(res.data.totalCount)
            this.handleViewTraineeBaseInfo(this.listClassroomTrainee[0])
          }
        }
      })
    },

    // 获取属于当前教师的课堂
    getAllClassroom() {
      const obj = { ctId: this.ctId }
      this.$api.classroomMember.queryClassroomList(obj).then(res => {
        if (res.code === 0) {
          this.allClassroom = res.data
        } else {
          toast(res.msg)
        }
      })
    },

    // 打开课堂选择弹出框
    studentToClassroom() {
      // 获取所有课堂
      this.getAllClassroom()
      $('#to-classroom').modal('show')
    },

    /**
             *  课堂选择改变事件
             */
    changeSelect(val) {
      this.checkedAll = val.length === this.allClassroom.length
    },

    /**
             *  权限人全选单击事件
             */
    clickCheckedAll() {
      this.currSelectionClass = []
      if (this.checkedAll) {
        this.allClassroom.map((item) => {
          this.currSelectionClass.push(item.ct_id)
        })
      } else {
        this.currSelectionClass = []
      }
    },

    // 一键添加课堂成员时关闭课堂选择弹出框
    handleToClassroomCancel() {
      $('#to-classroom').modal('hide')
      this.currSelectionClass = []
      this.checkedAll = false
    },

    // 提交课堂选择
    handleToClassroomSubmit() {
      if (this.currSelectionClass.length <= 0) {
        toast('请选择课堂')
        return false
      }
      const obj = { ctIds: this.currSelectionClass }
      $('#to-classroom').modal('hide')
      this.$api.classroomMember.oneClickToJoinClassroom(this.ctId, obj).then(res => {
        if (res.code === 0) {
          this.isShowPage()
          // 刷新上方助教信息
          this.$parent.viewPkgInfo()
        }
        toast(res.msg)
      })
    }

  }
}
</script>

<style scoped>
    /* 左侧导航显示begin */
    .classroom-member-tab{
        height: 40px;
        display: flex;
        padding-top: 5px;
    }
    .tab-classroom-member, .tab-classroom-group{
        width: 50%;
        line-height: 35px;
        text-align: center;
        cursor: pointer;

    }
    .tab-classroom-member:hover{
        color: #ff740e;
    }
    .tab-classroom-group:hover{
        color: #ff740e;
    }
    .classroom-member-active{
        background-color: #fff;
        color: #0079fe;
        border-bottom: 2px solid #0079fe;
    }
    /* 左侧导航显示end */
    .to-main:hover{
      color: #007bff;
      cursor: pointer;
    }
    .group-form{
        display:flex;
        align-items: center;
        padding:10px 0;
    }
    .group-form .group-name{
        width:25%;
        padding-left: 15px;
    }
    .group-form .group-name > span{
        color: red;
        margin-left: 2px;
    }
    .changeTeach-bottom{
        top: 32px;
    }
    .changeTeach-top{
       top: -78px;
    }
    .classroom-rembers-box{
        text-align: left;
        padding-top: 15px;
    }
    #classroomMember  > li {
        height: 30px;
        line-height: 30px;
    }
  /* 课堂成员start */
    .classroom-student-hidden{
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 20%;
      overflow: hidden;
    }
    .classroom-student-state{
      position: absolute;
      top: 6px;
      left:-35px;
      width: 100px;
      height:20px;
      transform: rotate(-45deg);
      font-size: 12px;
      line-height:20px;
      text-align: center;
      color: #fff;
    }
    .classroom-student-state-sign{
      background-color: #ff767c;
    }
    .classroom-student-state-teacher{
      background-color: #18B82C;
    }
    .class-member{
        text-align:left;
    }
    .class-member-header{
        display: flex;
        justify-content: space-between;
        padding:15px 10px;
    }
    .class-member-header .class-member-num{
        font-weight: 600;
    }
    .class-member-header .member-manger-box{
        display: flex;
        color:#007bff;
    }
    .class-member-header .member-manger{
        display: flex;
        margin-right:30px;
        cursor: pointer;
    }
    /*.class-member-header .member-manger > img{
        vertical-align: middle;
        margin-right: 3px;
    }*/
    .class-member-header .member-manger .import-member-icon{
      margin-top: 4px;
      width: 16px;
      height: 16px;
    }
    .class-member-header .member-manger > span{
        display: inline-block;
        margin-left:8px;
    }
    .class-member-con{
        display: flex;
        width:100%;
        height:100%;
        /* border-top: 1px solid #eee; */
    }
    .class-member-con .class-member-con-left{
        position: relative;
        /* width: 27%; */
        width: 25%;
        margin-left: 5px;
        /* height:100%; */
        box-shadow:rgba(0, 0, 0, 0.1) 0px 0px 5px 0px;
        border-radius: 5px;
        background-color: #fff;
        /* border-right: 1px solid #eee; */
    }
    .classroom-member-box{
        position: relative;
    }
    .classroom-member-box .search-box{
        position: relative;
        width: 90%;
        height: 35px;
        /* border: 1px solid #ccc;
        border-radius: 3px;
        line-height: 35px; */
        margin:20px auto 20px;
    }
    /* .classroom-member-box .search-box >input{
        width:90%;
        height:31px;
        line-height: 31px;
        border: 0;
        font-size: 16px;
        outline: none;
    } */
    .classroom-member-box .search-box > img{
        cursor: pointer;
    }
    ::-webkit-input-placeholder{
        color: #bbb;
    }
    .classroom-member-box .search-box >img{
        position: absolute;
        top:3px;
        right:10px;
    }
    .class-member-con-left .class-member-list .class-member-item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 9px 10px;
        border-bottom: 1px solid #f6f6f6;
        cursor: pointer;
        /*overflow: hidden;*/
        position: relative;
    }
    .class-member-con-left .class-member-list .class-member-item:hover{
        background-color: #f5f5f5;
    }
    .class-member-con-left .class-member-list .class-member-item .class-member-info{
        display: flex;
        /* justify-content: space-between; */
        align-items: center;
        /* width:45%; */
        padding:0 10px;
    }
    .class-member-list .class-member-item .class-member-info .user-header-img{
        width:40px;
        height:40px;
        border-radius: 50%;
        margin: 0 15px;
    }
    .class-member-list .class-member-item .class-member-info .member-name .mobile{
        color: #aaa;
        padding:2px 0;
        font-size: 14px;
    }
    .class-member-list .class-member-item .class-member-info:hover .member-name .traineeName{
        color: #007bff;
    }
    .class-member-con-left .class-member-list .class-member-item  .pull-down-btn > i{
       cursor: pointer;
    }
    .class-member-con-left .scroll-btn{
        position: absolute;
        bottom: 0;
        left:0;
        width: 100%;
        height:50px;
        line-height: 50px;
        text-align: center;
        border-top: 1px solid #f6f6f6;
        border-bottom: 1px solid #f6f6f6;
    }
    .class-member-con-left .scroll-btn > img{
        margin-right:20px;
        cursor: pointer;
    }
    .class-member-con .class-member-con-right{
        /* width:72%; */
        width: 74%;
        height:100%;
    }
    .class-member-con-right .head-user-info{
        display: flex;
        align-items: center;
        padding:10px 20px;
        border-bottom: 1px solid #eee;
    }
    .class-member-con-right .head-user-info .user-header-img{
        width:90px;
        height:90px;
        border-radius: 50%;
    }
    .class-member-con-right .head-user-info .user-info{
        margin-left:20px;
        width: 500px;
        overflow: hidden;
    }
    .class-member-con-right .head-user-info .user-info > p{
        color:#666;
        padding:3px 0;
        /* font-weight:600; */
    }
    .class-member-con-right .head-user-info .user-info > .traineeName{
        color: #000;
    }
    .class-member-con-right .head-user-info .user-info > .remark{
        font-size: 14px;
    }
    .class-member-con-right .head-user-info .detail{
        color:#007bff;
        cursor: pointer;
    }
    .class-member-con-right .head-user-info .detail > img{
        width:17px;
        height:17px;
        margin-right: 3px;
    }
    .class-member-con-right .head-user-info .detail > span{
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
    }
    .class-member-con-right .chart-con{
        display: flex;
        width:100%;
        border-bottom: 1px solid #eee;
    }
    .chart-con .empirical-value{
        border-right: 2px solid #eee;
    }
    .chart-con .chart-comm{
        width:50%;
        padding:20px;
    }
    .chart-con .chart-comm .title{
        font-weight:400;
        color:#333;
    }
    .chart-con .chart-comm .title span{
        display: inline-block;
    }
    .chart-con .empirical-value .title .value{
        font-size:26px;
        color:#f19142;
        vertical-align: middle;
    }
    .chart-con .textbook-study .title .study-rate{
        font-size:26px;
        vertical-align: middle;
    }
    .chart-con .chart-comm .chart .charts-left{
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        height:auto;
    }
    .chart-con .chart-comm .chart .charts-left .describe > p{
        padding:5px 0;
    }
    .chart-con .chart-comm .chart .charts-left .describe > p > span{
        display: inline-block;
        margin-right: 7px;
    }
    .chart-con .chart-comm .chart .charts-left .describe > p .color-box{
        width:10px;
        height:10px;
        background-color: #fec154;
    }
    .member-detail{
        width: 100%;
        height: 270px;
    }
    .member-detail .detail-list{
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        padding:30px 0;
    }
    .member-detail .detail-item{
        flex:1;
        display: flex;
        align-items:center;
    }
    .member-detail .detail-item .detail-chart .title{
        font-weight:400;
        color:#000;
        text-align: center;
    }
    .member-detail .detail-item .describe{
        margin-top:20px;
    }
    .member-detail .detail-item .describe >p{
        padding:3px 0;
        font-size: 15px;
    }
    .study-case .case-list{
        display: flex;
        align-items: center;
        text-align: center;
        border-top: 1px solid #eee;
    }
    .study-case .case-list .case-item{
        flex: 1;
        padding:20px;
        /* padding-bottom: 0; */
    }
    .study-case .case-list .case-item .detail{
        margin-top:15px;
    }
    .study-case .case-list .case-item .detail .number> span{
        display: inline-block;
        vertical-align: middle;
    }
    .study-case .case-list .case-item + .case-item{
        border-left: 1px solid #eee;
    }
    .study-case .case-list .case-item .font-size26{
        font-size: 26px;
    }
    .class-sign-in{
        width:100%;
        background-color:#fafafa;
    }
    .class-sign-in .location{
        display: flex;
        align-items: center;
        width: 100%;
        height:60px;
        line-height:60px;
        padding-left:20px;
    }
    .class-sign-in .location .localtion-list{
        display: flex;
        align-items: center;
    }
    .class-sign-in .location .localtion-list .localtion-item+ .localtion-item::before{
        content: '>';
    }
    .class-signin-con{
        padding:0px 20px;
        background-color:#fff;
    }
    .class-signin-con .head-title{
        width:100%;
        height:80px;
        line-height:80px;
        text-align: left;
        border-bottom: 1px solid #eee;
    }
    .class-signin-con .head-title > span{
        display: inline-block;
        /* vertical-align: middle; */
    }
    .class-signin-con .head-title .square{
        width: 10px;
        height:10px;
        background-color:#007bff;
        margin-right:10px;
    }
    .class-signin-con .head-title .title{
        font-size: 18px;
    }
    .class-signin-con .sign-in-con{
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding:20px 0px;
    }
    .class-signin-con .sign-in-con > div{
        display: flex;
        width:48%;
        height:210px;
        border-radius: 4px;
        padding:25px;
    }
    .class-signin-con .sign-in-con .left-start-sign-in{
        background-color: #ef963f;
    }
    .class-signin-con .sign-in-con .right-statistics{
        background-color: #007bff;
    }
    .class-signin-con .sign-in-con .title-con h2{
        color:#fff;
        font-size:20px;
        font-weight:400;
        margin-top:10px;
    }
    .class-signin-con .sign-in-con .title-con .start-btn{
        width:180px;
        height:45px;
        line-height:50px;
        text-align: center;
        border-radius: 3px;
        font-size: 18px;
        color:#fff;
        border: 1px solid #fff;
        margin-top: 60px;
        cursor: pointer;
    }
    .min-title{
        width:100%;
        height: 60px;
        line-height:60px;
        color:#333;
        font-size: 18px;
    }
    .history-signin-list{
        width: 100%;
        border-bottom: 1px solid #eee;
    }
    .history-signin-list .history-item{
        display: flex;
        padding:15px;
        border-top: 1px solid #eee;
    }
    .history-signin-list .history-item .sign-in-type{
        flex: 3;
    }
    .history-signin-list .history-item .sign-in-number{
        flex: 3;
    }
    .history-signin-list .history-item .sign-in-time{
        flex: 3;
    }
    .history-signin-list .history-item .operation{

    }
    .history-signin-list .history-item .operation >img{
        margin-left:10px;
        cursor: pointer;
    }
    .class-sign-in-type{
        width: 100%;
        height:410px;
        padding:10px 25px;
        background-color: #eff3f3;
        text-align: center;

    }
    .class-sign-in-type .sign-in-type-list{
        display: flex;
        justify-content: space-around;
        width: 100%;
        height:100%;
    }
    .class-sign-in-type .sign-in-type-list .type-item{
        width:28%;
        height:100%;
        border-radius: 5px;
        background-color: #fff;
        cursor: pointer;
    }
    .class-sign-in-type .sign-in-type-list .type-item .sing-in-img{
        background-color: #007bff;
        padding:45px 0px;
    }
    .class-sign-in-type .sign-in-type-list .type-item .sing-in-img > img{
        width:140px;
        height:150px;
    }
    .class-sign-in-type .sign-in-type-list  .click-sign-in .sing-in-img{
        background-color: #ef7f65;
    }
    .class-sign-in-type .sign-in-type-list  .gesture-sign-in .sing-in-img{
        background-color: #a27ed9;
    }
    .class-sign-in-type .sign-in-type-list .type-item .sing-in-img{
        width:100%;
    }
    .class-sign-in-type .sign-in-type-list .type-item .sign-in-type-introduce{
        margin-top:35px;
    }
    .sign-in-type-list .type-item .sign-in-type-introduce .type-title{
        font-size: 18px;
    }
    .sign-in-type-list .type-item .sign-in-type-introduce > p{
        padding:5px 0;
    }
    /* .any-sign-in-modal{
        font-size: 20px;
    }
    .any-sign-in-modal .modal-header .modal-title{
        color:#9a9a9a;
    } */
    .duration-astrict-main .time-title{
        padding:40px 0;
    }
    .duration-astrict-main .limit-time{
        color: #06bdde;
    }
    .duration-astrict-main .set-time-group{
        display: flex;
        align-items: center;
        justify-content: center;
        padding:20px 0;
    }
    .duration-astrict-main .set-time-group .btn-group{
        border: 1px solid #e8e8e8;
    }
    .duration-astrict-main .set-time-group .time-text{
        color:#9f9f9f;
        padding:0 5px;
    }
    .duration-astrict-main{
        text-align: center;
        font-size: 20px;
    }
    .duration-astrict-main .immediately-start{
        display: inline-block;
        width:130px;
        height:40px;
        font-size: 18px;
        line-height:40px;
        background-color:#00bbdd;
        text-align: center;
        border-radius: 25px;
        color:#fff;
        font-weight: 600;
        margin: 30px 0;
        cursor: pointer;
    }
    /* 课堂成员end */

    /* 查看签到统计 */
    .attendance-rate-cartogram-box{
        display: flex;
        width: 100%;
        border: 1px solid #999;
        padding:20px;
    }
    .attendance-rate-cartogram-box .left-statistics{
        width: 70%;
    }
    .attendance-rate-cartogram-box .right-statistics-detail{
        width: 30%;
        border-left: 1px solid #ddd;
    }

    .attendance-rate-cartogram-box .right-statistics-detail > div{
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 120px;
        margin:20px 0;
    }
    .attendance-rate-cartogram-box .right-statistics-detail .checking-in-num > img{
        /* width: 120px; */
    }
    .attendance-rate-cartogram-box .right-statistics-detail .right-detail{
        /* height: 100%; */
    }
    .attendance-rate-cartogram-box .right-statistics-detail .right-detail h3{
        font-size: 22px;
        font-weight: 400;
        text-align: center;
    }
    .attendance-rate-cartogram-box .right-statistics-detail .right-detail h3 > p{
       padding: 12px 0;
    }
    .classroom-member-detail-table{
        width: 100%;
    }
    .comm-table{
        width: 100%;
    }
    .comm-table tr{
        width: 100%;
    }
    .comm-table tr td,th{
        padding:0 10px;
    }
    .comm-table .t-head{
        height: 60px;
        line-height: 60px;
        background-color: #eff3f3;
    }
    .comm-table .t-body{
        height: 70px;
        line-height: 70px;
        border-bottom: 1px solid #e1e1e1;
    }
    .comm-table .t-body > td > img{
        width: 50px;
        height: 50px;
        margin-right: 10px;
    }
    /* 班级学员start */
    .import-calss-members-box{
        width:100%;
    }
    .import-calss-members-box .import-calss-members-con{
        padding:20px;
        /* padding-top:0; */
    }
    .import-calss-members-box .top-menu-box{
        display: flex;
        justify-content: space-between;
        /* align-items: center; */
    }
    .import-calss-members-box .top-menu-box .right-operation-box{
        display: flex;
    }
    .import-calss-members-box .comm-table .t-body{
        cursor: pointer;
    }
    .import-calss-members-box .comm-table .t-body:hover{
       background-color: #fafafa;
    }
    .import-calss-members-box .search-box{
        width: 30%;
       margin: 0px 0 20px;
    }
    .import-calss-members-box .top-menu-box .impotr-btn .import-member-icon{
        width: 20px;
        height: 20px;
    }
    .import-calss-members-box .top-menu-box .right-operation-box > div{
        margin-left: 25px;
    }
    .top-menu-box .right-operation-box .selected-member-num{
       color: #999;
    }
    .back .back-icon{
        width: 20px;
        height: 20px;
    }
    .import-calss-members-box .top-menu-box .impotr-btn,.back{
       cursor: pointer;
    }
    .import-calss-members-box .top-menu-box .impotr-btn:hover,.back:hover{
       color: #007bff;
    }
    /* 班级学员end */

    /* 小组管理start */
    .grouping-manager-box{
        width: 100%;
        height: 100%;
    }
    .grouping-manager-box .grouping-manage-con{
        width: 100%;
        display: flex;
    }
    .left-grouping-box{
        overflow-y: scroll;
        padding-bottom: 20px;
        min-height: 500px;
        height: calc(100vh - 70px - 140px - 180px );
    }
    .left-grouping-box .grouping-top{
        width: 100%;
        display: flex;
        align-content: center;
        justify-content: space-between;
        padding: 15px;
    }
    .left-grouping-box .grouping-top > span{
        display: inline-block;
        padding-left:7px;
        line-height: 31px;
        color: #007bff;
        border-left: 2px solid #007bff;
    }
    .left-grouping-box .grouping-list .grouping-list-item{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding:15px;
        border-bottom: 1px solid #fafafa;
        cursor: pointer;
    }
    .left-grouping-box .grouping-list .grouping-list-item .right-arrow > span{
        display: inline-block;
        vertical-align: middle;
    }
    .left-grouping-box .grouping-list .grouping-list-item .right-arrow > img{
        vertical-align: middle;
    }
    .left-grouping-box .grouping-list .grouping-list-item:hover{
        background-color: #f5f5f5;
    }
    .grouping-student{
        display: flex;
        padding: 10px 15px;
        line-height: 30px;
    }
    .grouping-student > div{
        margin-left: 20px;
    }
    .right-grouping-member-box{
        /* width: 72%; */
        width: 74%;
        padding: 10px 15px;
    }
    .right-grouping-member-box .grouping-member-detail-top {
        display: flex;
        align-items: center;
        justify-content: space-between;

        box-shadow: 0 5px 5px -5px rgb(0 0 0 / 10%);
        border-bottom: 1px #e0e0e0 solid;
        padding-bottom: 10px;
        box-sizing: border-box;
    }
    .right-grouping-member-box .grouping-member-detail-top-left{
        display: flex;
        align-items: center;
    }
    .right-grouping-member-box .grouping-member-detail-top .grouping-name{
        font-size: 20px;
        padding-right: 10px;
         box-sizing: border-box;
    }
    .right-grouping-member-box .grouping-member-detail-top .search-box{
        /* width: 30%; */
        margin: 0px;

        width: 150px !important;
        padding-right: 10px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .right-grouping-member-box .grouping-member-detail-top .right-btn-list{
        display: flex;
    }
    .right-grouping-member-box .grouping-member-detail-top .right-btn-list > div{
        margin-left: 15px;
    }
    .right-grouping-member-box  .right-btn-list .add-grouping-member-btn{
        cursor: pointer;
    }
    .right-grouping-member-box  .right-btn-list .add-grouping-member-btn:hover > span{
        color: #007bff;
    }
    .right-grouping-member-box .grouping-member-list-con h3{
        font-size: 20px;
        padding: 15px;
        border-bottom: 1px solid #eee;
    }
     .grouping-member-list{
        width: 100%;
        height: 400px;
    }
    .grouping-member-list .grouping-member-item{
        display: flex;
        align-items: center;
        width: 100%;
        padding:5px;
        border-bottom: 1px solid #eee;
        position: relative;
        overflow: hidden;
    }
    .grouping-member-list .grouping-member-item:hover{
        background-color: #f5f5f5;
    }
    .grouping-member-list .grouping-member-item .serial-number{
        flex: 1;
        text-align: center;
    }
    .grouping-member-list .grouping-member-item .member-name{
        flex: 2;
        margin-left: 30px;
    }
    .grouping-member-list .grouping-member-item .traineeSex{
        flex: 2;
        height: 28px;
        line-height: 28px;
        text-align: center;
    }
    .grouping-member-list .grouping-member-item .operation{
        width: 235px;
        padding-right: 5px;
        text-align: right;
    }
    .grouping-member-operation{
        position: absolute;
        right: 20px;
        text-align: center;
    }
    .grouping-member-list .grouping-member-item .member-name > img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
    }

    .main-top{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .main-top .search-box{
        width: 100%;
        margin: 10px 0 20px;
    }
    .main-list-top{
        display: flex;
        justify-content: space-between;
        background-color: #eff3f3;
        padding: 10px;
    }
    .main-list-top .left-operation-box{
        display: flex;
        align-items: center;
    }
    .main-list-top .left-operation-box .selected-member-num{
        color: #999;
        margin-left: 20px;
    }
    .main-list-top .sure-btn{
        color: #007bff;
        cursor: pointer;
    }
    .main-list{
        min-height: 228px;
    }
    .main-list .main-list-item{
        display: flex;
        align-items: center;
        padding: 10px;
        cursor: pointer;
        border-bottom: 1px solid #eee;
    }
    .main-list .main-list-item:hover{
        background-color: #f5f5f5;
    }
    /* .main-list .main-list-item > input{
        flex:1;
    } */
    .main-list .main-list-item > .trainee-info{
        flex:2;
        margin-left: 30px;
    }
    .main-list .main-list-item .trainee-info > img{
        width: 30px;
        height: 30px;
        margin-right: 15px;
    }
    .group-leader{
      position: absolute;
      /* top: 6px;
      left:-35px; */
      width: 100px;
      height:20px;
      transform: rotate(-45deg);
      /* font-size: 12px; */
      line-height:20px;
      text-align: center;
      color: #fff;
      background-color: #18B82C;

      font-size: 10px ;
      top: 11px;
      left: -29px;
    }
    /* 新增小组模态框 */
    .group-input{
      width: 65%;
    }
    .del-group-input{
      width: 28px;
      cursor: pointer;
    }
    .add-group-input-btn{
      text-align: right;
      padding-right: 12%;
      color: #007bff;
      cursor: pointer;
    }
    /* 小组管理end */
    /* 经验明细样式 */
    .empirical{
        height: 400px;
    }
    .empirical-msg{
        width: 100%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .empirical-content{
        height: 350px;
    }
    .empirical-title{
        height: 50px;
        line-height: 50px;
        background-color: #eff3f3;
        text-align: left;
        display: flex;
    }
    .empirical-title-time{
        padding-left: 10px;
        width: 35%;
    }
    .empirical-title-operation{
        width: 45%;
    }
    .empirical-title-value{
        width: 15%;
    }
    .empirical-info{
        height: 240px;
    }
    .empirical-details{
        height: 40px;
        line-height: 40px;
        text-align: left;
        display: flex;
    }
    .empirical-details:hover{
        background-color: #F5F5F5;
    }
    /* 滚动条样式 */
    ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
    }
    ::-webkit-scrollbar-track-piece {
        -webkit-border-radius: 6px;
    }
    ::-webkit-scrollbar-thumb:vertical {
        height: 5px;
        background-color: rgba(125, 125, 125, 0.7);
        -webkit-border-radius: 6px;
    }
    ::-webkit-scrollbar-thumb:horizontal {
        width: 5px;
        background-color: rgba(125, 125, 125, 0.7);
        -webkit-border-radius: 6px;
    }
    /* 头像上传 */
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    /* 饿了么下拉框的样式 */
    .el-select /deep/ .select-popper {
        z-index: 8888 !important;
        top: auto !important;
        left: auto !important;
        text-align: left;
    }
    .el-checkbox{
        text-align: right;
        width: 100%;
        padding-right: 10px;
    }
    /* 课堂选择弹出框样式 */
    .selection-class{
        display: flex;
        padding: 15px 0 30px 15px;
    }

    .main-list-del{
        flex-wrap: wrap;
        display: flex;
        box-sizing: border-box;
    }
    .main-list-del .main-list-item{
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        border-bottom: none;
        flex-direction: column;
        margin: 10px 10px 0 0;
        position: relative;
        box-sizing: border-box;
        width: 80px;
        height: 80px;
        overflow: hidden;
    }
    .main-list-del .main-list-item img{
        width: 40px;
        height: 40px;
        border-radius: 5px;
        margin-bottom: 4px;
        box-sizing: border-box;
    }
    .main-list-del .main-list-item  input{
        position: absolute;
        right: 3px;
        top: 3px;
    }
    .main-list-del .main-list-item  span{
        /* background-color: rgba(0, 0, 0, 0.46); */
        width: 100%;
        text-align: center;
        display: -webkit-box;
        overflow: hidden !important;
        text-overflow: ellipsis;
        word-break: break-all;
        -webkit-line-clamp:1;
        -webkit-box-orient:vertical;/*这是设置显示的多少行 */

    }
    .search-box-del{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .search-box-del .el-input{
        width: 43%;
    }

     .search-box-setting-identity{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .search-box-setting-identity .el-input,
    .search-box-setting-identity .el-select{
        width: 28%;
    }

    .msgModalDel{
        z-index: 65536 !important;
    }
    .msgModalDelBackdrop{
        z-index: 65535 !important;
    }

    .el-table.grouping-member-table-list{
        height: 470px;
        /* overflow-y: auto; */
    }
    .el-table.grouping-member-table-list /deep/ td,
    .el-table.grouping-member-table-list /deep/ th{
        padding: 5px 0 !important;
    }
    .grouping-member-table-list .grouping-member-table-name-wrapper{
        display: flex;
        align-items: center;
        justify-content: centers;
    }
    .grouping-member-table-list .grouping-member-table-img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
        box-sizing: border-box;
    }
    .grouping-member-table-btns{
        display: flex;
        align-items: center;
        background-color: #f5f5f5;
    }
    .right-grouping-member-box .grouping-member-list-con{
        padding-top: 5px;
        box-sizing: border-box;
    }
    .awaitAuditTraineeDialogMainList{
        max-height: 50vh;
        overflow-y: auto;
    }
</style>
