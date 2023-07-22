<!-- 新增测试活动页面 -->
<template>
    <div class="test-activity">

      <!-- 当前位置导航begin -->
      <div class="present-localtion">
        <div>
          当前位置：<a class="cursor" @click="goToPageActivityList">活动列表</a> > <span class="present-localtion-title">{{pageTitle}}</span>
        </div>
        <div class="classroom-back">
          <i class="fa fa-angle-left classroom-back-icon" aria-hidden="true" @click="goToPageActivityList()"></i>
          <span @click="goToPageActivityList()">返回</span>
        </div>
      </div>
      <!-- 当前位置导航end -->

      <!-- 步骤条begin -->
      <div class="article-steps">
        <el-steps :active="stepValue" align-center process-status="finish" finish-status="success">
          <el-step title="编辑题目" description="" style="cursor: pointer;" @click.native="toEditQueation"></el-step>
          <el-step title="预览题目" description="" style="cursor: pointer;" @click.native="toPreviewQuestion"></el-step>
          <el-step title="填写信息" description="" style="cursor: pointer;" @click.native="toFillInfo"></el-step>
        </el-steps>
      </div>
      <!-- 步骤条end -->

      <!-- 活动内容填写区域begin -->
      <div style="font-size: 14px;overflow: hidden;">
        <!-- 题目选择begin -->
        <div v-show="stepValue === 0">
          <div style="width: 95%;margin: 20px auto;text-align: left;font-weight: bold;">编辑测试题目：</div>

          <!-- 不同题目类型数量显示 -->
          <div class="question-num">
            <span>单选题：{{testActivity.singleChoseNum}}</span>
            <span>多选题：{{testActivity.multipleChoseNum}}</span>
            <span>判断题：{{testActivity.judgeNum}}</span>
            <span>填空题：{{testActivity.gapFillingNum}}</span>
            <span>简答题：{{testActivity.shortAnswerNum}}</span>
            <span>复合题：{{testActivity.compositeNum}}</span>
          </div>

          <!-- 选择题目 -->
          <el-dialog
            title="题库题目选择"
            :visible.sync="isShowDialog"
            width="60%"
            @opened="editQuestioInit"
            :close-on-click-modal="false">
            <!-- <div style="height: 40px;width: 120px;display: flex">
              <div  style="height: 40px;border: 1px #bbbbbb solid;width: 80px;border-bottom: none;border-right: none;font-size: 14px;line-height: 40px">第&nbsp;&nbsp;1&nbsp;&nbsp;题</div>
              <div  style="height: 40px;background: #4acacb;width: 40px;line-height: 40px">
                <i class="fa fa-heart-o" aria-hidden="true" style="color: white;"></i>
              </div>
            </div> -->
            <div style="border: 1px #bbbbbb solid;height: 400px;display: flex;">
              <!-- <div style="height: 400px;line-height: 400px;">
                还没有添加题目，请点击
                <span style="color: #158aeb">添加题目</span>
                从我的题库中添加
              </div> -->
              <!-- 题目类型添加区域 -->
              <div class="topic-type">
                <div class="choose-title">
                  知识点选择
                </div>
                <div class="choose-content">
                  <el-tree :data="topicTypeData" node-key="id" @check="handleTopicTypeCheck" ref="tree" show-checkbox :check-on-click-node="true">
                    <span slot-scope="{ data }">
                      {{data.name}}
                    </span>
                  </el-tree>
                </div>
              </div>
              <!-- 题目选择区域 -->
              <div class="topic-choose">
                <el-table
                    :data="topicData"
                    border
                    height="398"
                    style="width: 100%">
                    <el-table-column
                      label="已选知识点"
                      width="200">
                      <template slot-scope="scope">
                        <i class="el-icon-close cursor del-icon" @click="delTopic(scope.row)"></i>
                        <span class="topic-name">{{scope.row.name}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="topicNum"
                      label="题目数"
                      width="70">
                    </el-table-column>
                    <el-table-column
                      label="判断题">
                      <template slot-scope="scope">
                        <input type="number" v-model="scope.row.totalJudgeInput" class="topicInput" max="10" :oninput="'if(value>' + scope.row.totalJudge + ')value=' + scope.row.totalJudge" onkeyup="this.value=this.value.replace(/\D/g,'')"> /
                        {{scope.row.totalJudge}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="单选题">
                      <template slot-scope="scope">
                        <input type="number" v-model="scope.row.totalSingleChoseInput" class="topicInput" max="10" :oninput="'if(value>' + scope.row.totalSingleChose + ')value=' + scope.row.totalSingleChose" onkeyup="this.value=this.value.replace(/\D/g,'')"> /
                        {{scope.row.totalSingleChose}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="多选题">
                      <template slot-scope="scope">
                        <input type="number" v-model="scope.row.totalMultipleChoseInput" class="topicInput" max="10" :oninput="'if(value>' + scope.row.totalMultipleChose + ')value=' + scope.row.totalMultipleChose" onkeyup="this.value=this.value.replace(/\D/g,'')"> /
                        {{scope.row.totalMultipleChose}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="填空题">
                      <template slot-scope="scope">
                        <input type="number" v-model="scope.row.totalGapFillingInput" class="topicInput" max="10" :oninput="'if(value>' + scope.row.totalGapFilling + ')value=' + scope.row.totalGapFilling" onkeyup="this.value=this.value.replace(/\D/g,'')"> /
                        {{scope.row.totalGapFilling}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="简答题">
                      <template slot-scope="scope">
                        <input type="number" v-model="scope.row.totalShortAnswerInput" class="topicInput" max="10" :oninput="'if(value>' + scope.row.totalShortAnswer + ')value=' + scope.row.totalShortAnswer" onkeyup="this.value=this.value.replace(/\D/g,'')"> /
                        {{scope.row.totalShortAnswer}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="复合题">
                      <template slot-scope="scope">
                        <input type="number" v-model="scope.row.totalCompositeInput" class="topicInput" max="10" :oninput="'if(value>' + scope.row.totalComposite + ')value=' + scope.row.totalComposite" onkeyup="this.value=this.value.replace(/\D/g,'')"> /
                        {{scope.row.totalComposite}}
                      </template>
                    </el-table-column>
                  </el-table>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="isShowDialog = false">取 消</el-button>
              <el-button type="primary" @click="submitAddQuestionBank">确 定</el-button>
            </span>
          </el-dialog>

          <!-- 题目新增修改弹窗begin -->
          <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="50%"
            custom-class="saveTestDialogClass"
            @opened="editQuestioInit"
            :before-close="handleClose">
            <creator-test-question ref="editorQuestion"  v-if="dialogVisible" pagesType="1" :isEdit="creatorIsEdit"></creator-test-question>
            <span slot="footer" class="dialog-footer">
              <el-button @click="handleClose">取 消</el-button>
              <el-button type="primary" @click="handleSave">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 题目新增修改弹窗end -->

          <!-- 编辑题目 -->
          <div style="width: 95%;margin: 20px auto;" class="question-tabs">
            <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
              <el-tab-pane
                :key="index"
                v-for="(item, index) in questionsData"
                :label="'第' + (index + 1) + '题'"
                :name="index + ''"
              >

                <div class="question-area" v-if="item.questionsName === ''" style="line-height: 400px;">
                  <el-button size="small" type="primary" icon="el-icon-edit" @click="handleAddQuestionBank">从题库选择</el-button>
                  <el-button size="small" type="primary" icon="el-icon-edit" @click="handleAddQuestion">自主编辑</el-button>
                </div>

                <!-- 每小题题目显示区域begin -->
                <div class="question-area" v-if="item.questionsName !== ''">
                  <!-- 题目操作按钮区域begin -->
                  <div class="question-btn-area">
                    <el-button size="small" type="primary" icon="el-icon-edit" v-if="!item.questionsId" @click="handleEditQuestion">编辑</el-button>
                    <el-button size="small" type="primary" icon="el-icon-edit" v-if="item.questionsId" @click="reelectTopic(item)">重选</el-button>
                  </div>
                  <!-- 题目操作按钮区域end -->
                  <div class="test-question-right-center">
                        <ul class="quesList">
                            <li class="list-item">
                                <div class="question displayFlex2" style="margin-top:5px;" @click="handleHtml($event)">
                                  <div style="width:80px;">（{{item.questionsTypeName}}）</div><p style="margin: 0 0 10px;width:1000px;word-wrap:break-word;" v-html="item.questionsName"></p>
                                </div>

                                <!-- 非复合题选项显示 -->
                                <div v-if="item.questionsType !== '6'">
                                  <div class="options" v-if="item.optionList && item.optionList.length>0 && item.questionsType !== '5'" >
                                    <p v-for="(option, index0) in item.optionList" :key="index0" class="displayFlex2" @click="handleHtml($event)">
                                        <b style="margin-right:5px;">{{option.code}}.</b>
                                        <span v-html="option.content" style="word-wrap:break-word;"></span>
                                    </p>
                                    <div style="clear:both;"></div>
                                  </div>
                                  <div class="answer" style="padding: 10px 0;background-color: #fff;">
                                    <div class="answerCon">
                                        <div class="baseOrange displayFlex2" style="isplay: block;margin-bottom: 10px;" v-if="item.questionsType !== '4'">
                                          <span>正确答案：</span>
                                          <div v-if="item.optionList && item.optionList.length > 0 && item.questionsType !== '5'" class="displayFlex2">
                                            <div v-for="(item0, index0) in item.optionList" :key="index0" class="displayFlex2">
                                              <span v-if="!item.questionsId && item0.isRight === 'YES'" >{{item.questionsType !== '3' ? item0.code : ('A' === item0.code ? '对' : '错')}}</span>
                                              <span v-else-if="item.questionsId && item.replyIds.indexOf(item0.optionId) != -1" >{{item.questionsType !== '3' ? item0.code : ('A' === item0.code ? '对' : '错')}}</span>
                                            </div>
                                          </div>
                                          <div v-else-if="item.optionList && item.optionList.length > 0 && item.questionsType === '5'">
                                            <div v-for="(item0, index0) in item.optionList" :key="index0">
                                              填空{{index0 + 1}}：{{item0.content}}
                                            </div>
                                          </div>
                                        </div>
                                        <div class="displayFlex2">
                                          <div style="color: #FF3E96;margin-bottom: 10px;flex-shrink:0;margin-right:10px;">题目解析：</div>
                                          <div class="analysis" @click="handleHtml($event)">
                                            <p v-html="item.questionsParse"></p>
                                          </div>
                                        </div>

                                    </div>
                                  </div>
                                </div>

                                <!-- 复合题内题目显示 -->
                                <div v-if="item.questionsType === '6'" style="padding:0 20px;">
                                  <div v-for="(item1, index1) in item.questionList" :key="index1">
                                    <div class="question displayFlex2" style="margin-top:5px;" @click="handleHtml($event)">
                                      <div style="width:80px;">{{index1 + 1}}、({{item1.questionsTypeName}})</div><p style="margin: 0 0 10px;width:1000px;" v-html="item1.questionsName"></p>
                                    </div>
                                    <div v-if="item1.optionList && item1.optionList.length>0 && item1.questionsType !== '5'" class="options" style="margin-top:0;">
                                      <p v-for="(option, index0) in item1.optionList" :key="index0" class="displayFlex2" @click="handleHtml($event)">
                                          <b style="margin-right:5px;">{{option.code}}.</b>
                                          <span v-html="option.content"></span>
                                      </p>
                                      <div style="clear:both;"></div>
                                    </div>
                                    <div class="answer" style="padding: 10px 0;background-color: #fff;">
                                      <div class="answerCon">
                                          <div class="baseOrange displayFlex2" style="isplay: block;margin-bottom: 10px;" v-if="item.questionsType !== '4'">
                                            <span>正确答案：</span>
                                            <div v-if="item1.optionList && item1.optionList.length > 0 && item1.questionsType !== '5'" class="displayFlex2">
                                              <div v-for="(item0, index0) in item1.optionList" :key="index0" class="displayFlex2">
                                                <span v-if="!item1.questionsId && item0.isRight === 'YES'" >{{item1.questionsType !== '3' ? item0.code : ('A' === item0.code ? '对' : '错')}}</span>
                                                <span v-else-if="item1.questionsId && item1.replyIds.indexOf(item0.optionId) != -1" >{{item1.questionsType !== '3' ? item0.code : ('A' === item0.code ? '对' : '错')}}</span>
                                              </div>
                                            </div>
                                            <div v-else-if="item1.optionList && item1.optionList.length > 0 && item1.questionsType === '5'">
                                              <div v-for="(item0, index0) in item1.optionList" :key="index0">
                                                填空{{index0 + 1}}：{{item0.content}}
                                              </div>
                                            </div>
                                          </div>
                                          <div class="displayFlex2">
                                            <P style="color: #FF3E96;margin-bottom: 10px;">题目解析：</P>
                                            <div class="analysis" @click="handleHtml($event)">
                                              <p v-html="item1.questionsParse"></p>
                                            </div>
                                          </div>

                                      </div>
                                    </div>
                                  </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 每小题题目显示区域end -->


              </el-tab-pane>
            </el-tabs>
          </div>

          <!-- 图片预览标签 -->
          <div class="accessory-viewer" v-viewer style="display: none;">
            <img  :src="imgSrc" alt>
          </div>

          <!-- 上下回退操作 -->
          <div style="width: 94%;margin: 40px 3% 20px;text-align: center">
            <button type="button" class="btn btn-outline-primary"  style="font-size: 14px;width: 100px;margin-left: 10px;margin-right: 10px" @click="nextStep">下一步</button>
            <button type="button" class="btn btn-outline-secondary" style="font-size: 14px;width: 100px;margin-left: 10px" @click="goToPageActivityList">取消</button>
          </div>
        </div>
        <!-- 题目选择end -->

        <!-- 试卷预览begin -->
        <div v-if="stepValue === 1">

          <!-- 试卷预览 -->
          <cb-question-papers papersType="2" ref="question" :compositeQuestions="compositeQuestions" :gapFillingQuestions="gapFillingQuestions" :shortAnswerQuestions="shortAnswerQuestions" :choiceQuestions="choiceQuestions" :judgeQuestions="judgeQuestions"></cb-question-papers>

          <!-- 到底部操作 -->
          <div class="back-top" @click="backBottom">
            <img src="static\image\teaching_center\arrow_down_1.png" />
            <div>到底部</div>
          </div>

          <!-- 上下回退操作 -->
          <div style="width: 94%;margin: 40px 3% 20px;text-align: center">
            <button type="button" class="btn btn-outline-primary"  style="font-size: 14px;width: 100px;margin-left: 10px;margin-right: 10px" @click="stepValue -= 1">上一步</button>
            <button type="button" class="btn btn-outline-primary"  style="font-size: 14px;width: 100px;margin-left: 10px;margin-right: 10px" @click="toInfo">下一步</button>
            <button type="button" class="btn btn-outline-secondary" style="font-size: 14px;width: 100px;margin-left: 10px" @click="goToPageActivityList">取消</button>
          </div>
        </div>
        <!-- 试卷预览end -->

        <!-- 活动信息编辑begin -->
        <div v-show="stepValue === 2">

          <div style="width: 95%;margin: 10px auto;display: flex">
            <div style="width: 48%">
              <div style="text-align: left">标题</div>
              <input type="text" class="form-control" id="brainstormingTitle" v-model="testActivity.activityTitle" placeholder="请输入测试标题" style="font-size: 14px;height: 36px;margin-top: 10px">
              <!-- 错误提示 -->
              <div class="invalid-feedback col-10 textAlignLeft p-0 brainstormingTitleHint"><small>请填写活动标题！</small></div>
            </div>
            <!-- 所属章节 begin -->
            <div style="width: 48%;margin-left:4%;">
              <div style="text-align: left">所属章节</div>
              <div style="margin-top: 9px">
                <el-cascader :options="zNodes" clearable style="width:100%" :props="props" v-model="testActivity.chapterId" :show-all-levels="false" :disabled="disabledSelectTree || isView">
                </el-cascader>
                <!-- <div class="invalid-feedback col-10 textAlignLeft p-0 empiricalValueHint"><small >请选择章节！</small></div> -->
              </div>
            </div>
            <!-- 所属章节 end -->
          </div>

          <!-- 分值填写begin -->
          <div style="width: 95%;margin: 20px auto;display: flex;font-size: 14px;">
            <div style="width: 21%;margin-right: 1%; text-align: left" v-if="testActivity.singleChoseNum > 0">
              <div>单选题(共 {{testActivity.singleChoseNum}} 题/ {{testActivity.singleChoseNum  * testActivity.singleChoiceScore}} 分)</div>
              <div style="margin-top: 9px">
                每题
                <input type="number"
                  v-model="testActivity.singleChoiceScore"
                  maxlength="2"
                  :disabled="isView || testActivity.singleChoseNum <= 0"
                  class="topicInput"
                  onkeyup="value=value.replace(/[^0-9^\.]+/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')"/>
                分
                </div>
            </div>
            <div style="width: 21%;margin-right: 1%; text-align: left" v-if="testActivity.multipleChoseNum > 0">
              <div>多选题(共 {{testActivity.multipleChoseNum}} 题/ {{testActivity.multipleChoseNum * (10 * testActivity.multipleChoiceScore)/10}} 分)</div>
              <div style="margin-top: 9px">
                每题
                <input type="number" v-model="testActivity.multipleChoiceScore" maxlength="2" :disabled="isView || testActivity.multipleChoseNum <= 0" class="topicInput" onkeyup="value=value.replace(/[^0-9^\.]+/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')"/>
                分
                </div>
            </div>
            <div style="width: 21%;margin-right: 1%; text-align: left" v-if="testActivity.judgeNum > 0">
              <div>判断题(共 {{testActivity.judgeNum}} 题/ {{testActivity.judgeNum * (testActivity.judgeScore * 10)/10}} 分)</div>
              <div style="margin-top: 9px">
                每题
                <input type="number" v-model="testActivity.judgeScore" maxlength="2" :disabled="isView || testActivity.judgeNum <= 0" class="topicInput" onkeyup="value=value.replace(/[^0-9^\.]+/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')"/>
                分
                </div>
            </div>
            <div style="width: 27%;margin-right: 1%; text-align: left" v-if="testActivity.gapFillingNum > 0">
              <div>填空题(共 {{testActivity.gapFillingNum}} 题/ {{testActivity.gapFillingEmptyNum}} 空/ {{testActivity.gapFillingEmptyNum  * (testActivity.gapFillingScore * 10)/10}} 分)</div>
              <div style="margin-top: 9px">
                每空
                <input type="number" v-model="testActivity.gapFillingScore" maxlength="2" :disabled="isView || testActivity.gapFillingNum <= 0" class="topicInput" onkeyup="value=value.replace(/[^0-9^\.]+/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')"/>
                分
                </div>
            </div>
            <div style="width: 21%;margin-right: 1%; text-align: left" v-if="testActivity.shortAnswerNum > 0">
              <div>问答题(共 {{testActivity.shortAnswerNum}} 题/ {{testActivity.shortAnswerNum  * (testActivity.shortAnswerScore * 10)/10}} 分)</div>
              <div style="margin-top: 9px">
                每题
                <input type="number" v-model="testActivity.shortAnswerScore" maxlength="2" :disabled="isView || testActivity.shortAnswerNum <= 0" class="topicInput" onkeyup="value=value.replace(/[^0-9^\.]+/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')"/>
                分
                </div>
            </div>
            <div style="width: 29%; text-align: left" v-if="testActivity.compositeNum > 0">
              <div>复合题(共 {{testActivity.compositeNum}} 题/ {{testActivity.compositeMinNum}} 小题/ {{testActivity.compositeMinNum  * (testActivity.compositeScore * 10)/10}} 分)</div>
              <div style="margin-top: 9px">
                每小题
                <input type="number" v-model="testActivity.compositeScore" maxlength="2" :disabled="testActivity.compositeNum <= 0" class="topicInput" onkeyup="value=value.replace(/[^0-9^\.]+/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')"/>
                分
                </div>
            </div>
          </div>
          <div style="width: 95%;margin: 20px auto" v-if="testActivity.gapFillingNum > 0">
            <div class="custom-control custom-checkbox" style="text-align: left">
              <input type="checkbox" class="custom-control-input" false-value="1" true-value="2" v-model="testActivity.gapFillingScoreStandard" id="TestCheck2" :disabled="testActivity.gapFillingNum <= 0">
              <label class="custom-control-label" for="TestCheck2">填空题全部答对得分</label>
            </div>
          </div>
          <!-- 分值填写end -->

          <div style="width: 95%;margin: 20px auto;display: flex; ">
            <div style="text-align: left;width: 10%;line-height: 38px;">限定时间</div>
            <div style="width: 40%">
              <!--<div class="progress-bar" role="progressbar" aria-valuenow="60"
                    aria-valuemin="0" aria-valuemax="100" style="width: 40%;">
              </div>-->
              <el-slider
                v-model="testActivity.timeRuns"
                :step="30"
                :max="120"
                :show-tooltip="false"
                :marks="marks"
                show-stops>
              </el-slider>
            </div>
            <div style="line-height: 38px;margin-left: 20px;">
              {{testActivity.timeRuns === 0 ? '不限时' : testActivity.timeRuns+'分钟'}}
            </div>
          </div>
          <div style="width: 95%;margin: 20px auto;display: flex">
            <div style="text-align: left;width: 10%;line-height: 38px;">重做次数</div>
            <div style="width: 40%">
              <el-slider
                v-model="testActivity.redoNum"
                :step="1"
                :max="10"
                :show-tooltip="false"
                :marks="marks2"
                show-stops>
              </el-slider>
            </div>
            <div style="line-height: 38px;margin-left: 20px;">
              {{testActivity.redoNum === 0 ? '不允许重做' : (testActivity.redoNum +'次')}}
            </div>
          </div>
          <div style="width: 95%;margin: 40px auto 20px;display: flex">
            <div style="text-align: left;">查看答案的时机</div>
            <div class="custom-control custom-radio custom-control-inline" style="margin-left: 20px">
              <input type="radio" id="TestRadioInline1" name="customRadioInline1" value="1" v-model="testActivity.lookAnswerTime" class="custom-control-input">
              <label class="custom-control-label" for="TestRadioInline1">测试活动结束后查看答案</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline">
              <input type="radio" id="TestRadioInline2" name="customRadioInline1" value="2" v-model="testActivity.lookAnswerTime" class="custom-control-input">
              <label class="custom-control-label" for="TestRadioInline2">交卷之后查看答案</label>
            </div>
          </div>
          <div style="width: 95%;margin: 20px auto">
            <div class="custom-control custom-checkbox" style="text-align: left">
              <input type="checkbox" class="custom-control-input" false-value="N" true-value="Y" v-model="testActivity.isOutOrder" id="TestCheck1">
              <label class="custom-control-label" for="TestCheck1">题目乱序</label>
            </div>
          </div>
          <div style="font-size: 14px;color: #ff5524;text-align: left;width: 95%;margin: 10px auto">创建时无需设置自动结束时间，你可以在开始活动前设置</div>
          <div style="width: 94%;margin: 20px 3%;text-align: center">
            <button type="button" class="btn btn-outline-primary"  style="font-size: 14px;width: 100px;margin-left: 10px;margin-right: 10px" @click="stepValue -= 1">上一步</button>
            <button type="button" class="btn btn-outline-primary" :disabled="isViewSave"  style="font-size: 14px;width: 100px;margin-left: 10px;margin-right: 10px" @click="savaTestActivity">确定</button>
            <button type="button" class="btn btn-outline-secondary" style="font-size: 14px;width: 100px;margin-left: 10px" @click="goToPageActivityList">取消</button>
          </div>
        </div>
        <!-- 活动信息编辑end -->

      </div>
      <!-- 活动内容填写区域end -->

    </div>
</template>

<script>
    import {baseUrl, toast,alert, confirm,loadingModal,formVaildStyle, formInVaildStyle, preventBackgroundScrolling} from '@/utils/global';
    import CbTree from '@/components/cb-tree/index';
    import CbQuestionPapers from '@/components/cb-question-papers/index';
    import CreatorTestQuestion from '@/components/cb-creator-question/creator-test-question';
    import { trim } from '@/utils/global';
    export default {
        name: "save-test-activity",
        components: {
          CbTree,
          "cb-question-papers": CbQuestionPapers,
          "creator-test-question":CreatorTestQuestion
        },
        props: {

          //是否处于查看状态
          presentIsEditStates:{
            type:Boolean,
            required: true
          },
          // 权限标识
          hasPermission: {
            type: Boolean,
            required: true,
            default: true
          },
          // 教学包主键
          pkgId: {
            type: String,
            required: true,
            default: ''
          },
          ctId: {
            type: String,
            required: true,
            default: ''
          },
          subjectId: {
            type: String,
            required: true,
            default: ''
          },
          // 活动主键，修改、查看、时必传
          activityId: {
            type: String,
            required: true,
            default: ''
          },
          // 所属章节
          chapterId: {
            type: String,
            required: true,
            default: '',
          },
        },
        data () {
          return {
            props:{
                checkStrictly: true,
                value:'chapterId',
                label:'chapterName'
            },
            pageTitle: '创建测试活动',
            zNodes: [],   //所有章节数据
            setting: {
              data: {
                key: {
                  name: 'chapterName', // zTree 节点数据保存节点名称的属性名称。
                },
              }
            },
            stepValue: 0, //当前步骤值
            imgSrc: '',
            //测试活动对象
            testActivity: {
              activityId: "",     //活动id
              pkgId: "",          //教学包id
              chapterId: '',      //所属章节id
              activityTitle: "",  //活动标题
              resgroupId: '0',     //所属分组
              timeRuns: 0,    //限定时间
              redoNum: 0,      //重做次数
              lookAnswerTime: '1',    //查看答案时机
              isOutOrder: 'N',      //题目是否乱序
              singleChoiceScore: 1,      //单选题分值
              multipleChoiceScore: 1,     //多选题分值
              judgeScore: 1,      //判断题分值
              gapFillingScore: 1, //填空题分值
              shortAnswerScore: 1,     //简答题分值
              compositeScore: 1,     //复合题分值
              singleChoseNum: 0,    //单选题数量
              multipleChoseNum: 0,  //多选题数量
              judgeNum: 0,  //判断题数量
              gapFillingNum: 0,   //填空题数量
              shortAnswerNum: 0,    //简答题数量
              compositeNum: 0,  //复合题数量
              gapFillingEmptyNum: 0,  //填空题总空数
              compositeMinNum: 0, //复合题小题数
              gapFillingScoreStandard: "1",   //填空题全对才得分
            },
            //限定时间标记
            marks:{
              0: '不限时',
              30: '30',
              60: '60',
              90: '90',
              120: '120'
            },
            //操作次数标记
            marks2:{
              0: '不允许重做',
              1: '1',
              2: '2',
              3: '3',
              4: '4',
              5: '5',
              6: '6',
              7: '7',
              8: '8',
              9: '9',
              10: '10',
            },
            listActivityGroup:[],//活动分组列表
            empiricalValueList:[2,4,6],//经验值列表
            disabledSelectTree: false,  //是否选中章节
            //题目选择
            topicData: [

            ],
            //类型树数据
            topicTypeData: [],
            choiceQuestions: [],  //选择题数据
            judgeQuestions: [], //判断题数据
            gapFillingQuestions: [],  //填空题
            shortAnswerQuestions: [], //简答题数据
            compositeQuestions: [], //复合题数据
            questionsIds: [],
            //所有题目信息
            questionsData:[
              {
                questionsId: '',
                questionsName: '',
                questionsType: '',
                questionsTypeName: '',
                questionsParse: "",
                questionsComplexity: "",
                replyIds: '',
                optionList:[]
              }
            ],
            editableTabsValue: '0',
            dialogVisible: false,   //是否开启题目的新增编辑弹窗
            isAdd: true,
            dialogTitle: '新增题目',
            isShowDialog: false,
            toQuestionBank: false,
            creatorIsEdit: false,
            isViewSave: false,    //是否禁用确定确定按钮
          }
        },
        watch:{
          dialogVisible (val) {
            preventBackgroundScrolling(val)
          },
          isShowDialog (val) {
            preventBackgroundScrolling(val)
          },
          questionsData(){

          },
        },
        methods:{
          //对应步骤条跳转
          toEditQueation(){
            this.stepValue = 0;
          },
          toPreviewQuestion(){
            if (this.stepValue === 2) {
              this.stepValue = 1;
            }else if(this.stepValue === 0){
              this.nextStep();
            }
          },
          toFillInfo(){
            if (this.stepValue === 1) {
              this.toInfo();
            }
          },
          //预览v-html里面的图片
          handleHtml($event){
            if ($event.target) {
              if ($event.target.nodeName === 'IMG') {
                this.imgSrc = $event.target.currentSrc;
                let viewer = this.$el.querySelector(".accessory-viewer").$viewer;
                viewer.show();

              }
            }
          },
          //输入框验证
          choosecheckNumber(value) {
            console.log(value)
            if(value.length == 1) {
              value= value.replace(/[^1-9]/g, '');
            } else {
              value= value.replace(/\D/g, '');
            }
          },
          // choosecheckNumber(value) {
          //   if(value.length == 1) {
          //     this.testActivity.chooseScore= this.testActivity.chooseScore.replace(/[^1-9]/g, '');
          //   } else {
          //     this.testActivity.chooseScore= this.testActivity.chooseScore.replace(/\D/g, '');
          //   }
          // },
          /**
           *  存入选中的章节
           */
          onclick (treeNode, nodes, isMultiple) {
            this.testActivity.chapterId = treeNode.chapterId
          },
          //回底部
          backBottom() {
            let top = document.documentElement.scrollTop || document.body.scrollTop
            // 实现滚动效果
            const timeTop = setInterval(() => {
              document.body.scrollTop = document.documentElement.scrollTop = top += 50
              if (top >= document.documentElement.scrollHeight) {
                clearInterval(timeTop)
              }
            }, 5)
          },
          /**
           * 跳页面
           */
          goToPageActivityList () {
            this.$parent.changeVotoQuestionnairePage(false);
          },
          //获取活动分组
          getListActivityGroup(){
            this.$api.activity.listActivityGroup({pkgId:this.pkgId}).then(res=>{
              if(res.code===0){
                if(res.data&&res.data.length>0){
                  this.listActivityGroup=res.data;
                }
              }
            })
          },
          //获取所有类型题目数量
          getAllQuestionTypeNum(){
            let dataTemp = this.questionsData;
            this.testActivity.singleChoseNum = 0;
            this.testActivity.multipleChoseNum = 0;
            this.testActivity.judgeNum = 0;
            this.testActivity.gapFillingNum = 0;
            this.testActivity.gapFillingEmptyNum = 0;
            this.testActivity.compositeMinNum = 0;
            this.testActivity.shortAnswerNum = 0;
            this.testActivity.compositeNum = 0;
            for (let index = 0; index < dataTemp.length; index++) {
              if('1' === dataTemp[index].questionsType){
                this.testActivity.singleChoseNum += 1;
              }
              if('2' === dataTemp[index].questionsType){
                this.testActivity.multipleChoseNum += 1;
              }
              if('3' === dataTemp[index].questionsType){
                this.testActivity.judgeNum += 1;
              }
              if('4' === dataTemp[index].questionsType){
                this.testActivity.shortAnswerNum += 1;
              }
              if('5' === dataTemp[index].questionsType){
                this.testActivity.gapFillingEmptyNum += dataTemp[index].optionList.length;
                this.testActivity.gapFillingNum += 1;
              }
              if('6' === dataTemp[index].questionsType){
                this.testActivity.compositeMinNum += dataTemp[index].questionList.length;
                this.testActivity.compositeNum += 1;
              }
            }
          },
          //重选题目
          reelectTopic(topic){
            let tempArr = [];
            //获取所有题目id
            for (let index = 0; index < this.questionsData.length; index++) {
              if (this.questionsData[index].questionsId) {
                tempArr.push(this.questionsData[index].questionsId);
              }
            }
            let tempString = tempArr.join(",");
            let formData = new FormData();
            formData.append('oldQuestionsId', tempString);
            formData.append('questionsId', topic.questionsId);

            this.$api.activityTest.randomQuestions(formData).then(res => {
              if (res.code === 0) {
                if ('6' === res.data.questionsType) {
                  res.data.questionList = res.data.children;
                }
                //替换题目
                for (let index = 0; index < this.questionsData.length; index++) {
                  if (topic.questionsId === this.questionsData[index].questionsId) {
                    this.questionsData.splice(index,1,res.data);
                  }
                }
              }else{
                toast(res.msg);
              }
            })
          },
          //删除题目类型选择
          delTopic(obj){
            for (let index = 0; index < this.topicData.length; index++) {
              if (this.topicData[index].chapterId === obj.chapterId) {
                this.topicData.splice(index,1);
                index--;
              }
            }
            this.$refs.tree.setChecked(obj.id,false,false);
          },
          //题目类型选中事件
          handleTopicTypeCheck(obj,allObj){
            let isPush = true;
            for (let index = 0; index < this.topicData.length; index++) {
              if (this.topicData[index].chapterId === obj.chapterId) {
                this.topicData.splice(index,1);
                isPush = false;
              }
            }
            if (isPush) {
              let temp = {
                subjectId: this.subjectId,
                chapterId: obj.chapterId,
                type: obj.type,
              };
              this.$api.activityTest.loadChapters(temp).then(res => {
                if (res.code === 0) {
                  obj.topicNum = res.data.choiceNumMap.totalSize;
                  obj.totalSingleChose = res.data.choiceNumMap.totalSingleChose;
                  obj.totalMultipleChose = res.data.choiceNumMap.totalMultipleChose;
                  obj.totalJudge = res.data.choiceNumMap.totalJudge;
                  obj.totalGapFilling = res.data.choiceNumMap.totalGapFilling;
                  obj.totalShortAnswer = res.data.choiceNumMap.totalShortAnswer;
                  obj.totalComposite = res.data.choiceNumMap.totalComposite;
                  obj.totalSingleChoseInput = '0';
                  obj.totalMultipleChoseInput = '0';
                  obj.totalJudgeInput = '0';
                  obj.totalGapFillingInput = '0';
                  obj.totalShortAnswerInput = '0';
                  obj.totalCompositeInput = '0';
                  this.topicData.push(obj);
                }
              })
            }
          },
          //获取选择章节数据
          getTopicTypeData(){
            let formDada=new FormData();
            formDada.append("pkgId",this.pkgId);
            this.$api.activityTest.queryTopChapter(formDada).then(res => {
              if (res.code === 0) {
                this.topicTypeData = res.data;
              }else{
                toast(res.msg);
              }
            })
          },
          //到试题预览页面
          nextStep(){
            if (this.questionsData.length > 0 && this.questionsData[0].questionsName !== '') {

              let that = this;
              // this.toQuestionBank = false;
              // confirm("是否将您新增的题目添加至题库",() => {
              //   that.toQuestionBank = true;
              // });

              //删除最后一个为空的题目
              let arrTemp = JSON.parse(JSON.stringify(this.questionsData));
              if (!arrTemp[arrTemp.length - 1].questionsName || arrTemp[arrTemp.length - 1].questionsName === '') {
                arrTemp.splice(arrTemp.length - 1,1);
              }


              for (let index = 0; index < arrTemp.length; index++) {
                if (arrTemp[index].questionsType != '4' && arrTemp[index].questionsType != '5' && arrTemp[index].questionsType != '6') {
                  for (let index0 = 0; index0 < arrTemp[index].optionList.length; index0++) {
                    if ((arrTemp[index].optionList[index0].optionId && arrTemp[index].replyIds.indexOf(arrTemp[index].optionList[index0].optionId) != -1) || (arrTemp[index].replyIds.indexOf(arrTemp[index].optionList[index0].code) != -1)) {
                      arrTemp[index].optionList[index0].isRight = 'YES';
                      arrTemp[index].optionList[index0].isModelAnswer = true;
                    }else{
                      arrTemp[index].optionList[index0].isRight = 'NO';
                      arrTemp[index].optionList[index0].isModelAnswer = false;
                    }
                  }
                }

                if (arrTemp[index].questionsType === '6') {
                  if (arrTemp[index].questionList) {
                    arrTemp[index].questionList.forEach(item => {
                      if (item.questionsType != '4' && item.questionsType != '5') {
                        for (let index0 = 0; index0 < item.optionList.length; index0++) {
                          if (( item.optionList[index0].optionId && item.replyIds.indexOf(item.optionList[index0].optionId) === -1) || (item.replyIds.indexOf(item.optionList[index0].code) != -1)) {
                            item.optionList[index0].isRight = 'YES';
                            item.optionList[index0].isModelAnswer = true;
                          }else{
                            item.optionList[index0].isRight = 'NO';
                            item.optionList[index0].isModelAnswer = false;
                          }
                        }
                      }
                    });
                  }
                }
              }
              this.choiceQuestions = [];
              this.judgeQuestions = [];
              this.gapFillingQuestions = [];
              this.shortAnswerQuestions = [];
              this.compositeQuestions = [];

              for (let index = 0; index < arrTemp.length; index++) {
                if('1' === arrTemp[index].questionsType || '2' === arrTemp[index].questionsType){
                  this.choiceQuestions.push(arrTemp[index]);
                }
                if('3' === arrTemp[index].questionsType){
                  this.judgeQuestions.push(arrTemp[index]);
                }
                if('4' === arrTemp[index].questionsType){
                  this.shortAnswerQuestions.push(arrTemp[index]);
                }
                if('5' === arrTemp[index].questionsType){
                  this.gapFillingQuestions.push(arrTemp[index]);
                }
                if('6' === arrTemp[index].questionsType){
                  this.compositeQuestions.push(arrTemp[index]);
                }
              }
              this.stepValue += 1;
            }else{
              toast("没有检测到题目，请编辑");
            }
          },
          //到信息填写页面
          toInfo(){
            this.questionsIds = this.$refs.question.getAllTopicId();
            if (this.questionsIds.length <= 0) {
              toast("至少需要添加一个题目");
              return false;
            }
            this.testActivity.choiceNum = this.$refs.question.getChoiceQuestionsLength();
            this.testActivity.judgeNum = this.$refs.question.getJudgeQuestionsLength();
            this.stepValue += 1;
          },

          //提交题目
          formBrainstormingVerifyBoolean(){
            //活动主题验证
            if(!this.testActivity.activityTitle){
                //出现提示
                formInVaildStyle('.brainstormingTitleHint',"#brainstormingTitle");
                $("#brainstormingTitle").focus();
                return false;
            }
            //清除提示
            formVaildStyle('.brainstormingTitleHint',"#brainstormingTitle");
            return true;
          },

          //提交测试活动
          savaTestActivity(){
            if (!this.formBrainstormingVerifyBoolean()) {
              return false;
            }
            this.isViewSave = true;
            let arrTemp = JSON.parse(JSON.stringify(this.questionsData));
            if (!arrTemp[arrTemp.length - 1].questionsName || arrTemp[arrTemp.length - 1].questionsName === '') {
              arrTemp.splice(arrTemp.length - 1,1);
            }
            // for (let index = 0; index < arrTemp.length; index++) {


            //   if (arrTemp[index].questionsType != '4' && arrTemp[index].questionsType != '5' && arrTemp[index].questionsType != '6') {
            //     for (let index0 = 0; index0 < arrTemp[index].optionList.length; index0++) {
            //       if (arrTemp[index].optionList[index0].isRight || (arrTemp[index].replyIds.indexOf(arrTemp[index].optionList[index0].optionId) != -1)) {
            //         arrTemp[index].optionList[index0].isRight = 'YES';
            //       }else{
            //         arrTemp[index].optionList[index0].isRight = 'NO';
            //       }
            //     }
            //   }

            //   if (arrTemp[index].questionsType === '6') {
            //     if (arrTemp[index].questionList) {
            //       arrTemp[index].questionList.forEach(item => {
            //         if (item.questionsType != '4' && item.questionsType != '5') {
            //           for (let index0 = 0; index0 < item.optionList.length; index0++) {
            //             if (item.optionList[index0].isRight || (item.replyIds.indexOf(item.optionList[index0].optionId) != -1)) {
            //               item.optionList[index0].isRight = 'YES';
            //             }else{
            //               item.optionList[index0].isRight = 'NO';
            //             }
            //           }
            //         }
            //       });
            //     }
            //   }

            // }



            let questions = this.questionsIds.join(",");
            let singleChoseScore = this.testActivity.singleChoseNum * (parseInt(this.testActivity.singleChoiceScore));
            let multipleChoseTotalScore = this.testActivity.multipleChoseNum * (parseInt(this.testActivity.multipleChoiceScore));
            let judgeTotalScore = this.testActivity.judgeNum * (parseInt(this.testActivity.judgeScore));
            let gapFillingTotalScore = this.testActivity.gapFillingEmptyNum * (parseInt(this.testActivity.gapFillingScore));
            let shortAnswerTotalScore = this.testActivity.shortAnswerNum * (parseInt(this.testActivity.shortAnswerScore));
            let compositeTotalScore = this.testActivity.compositeNum * (parseInt(this.testActivity.compositeScore));
            let redoNum = parseInt(this.testActivity.redoNum);
            let obj = {
              pkgId: this.pkgId,
              chapterId: (this.testActivity.chapterId && this.testActivity.chapterId.length > 0) ? this.testActivity.chapterId[this.testActivity.chapterId.length - 1] : '',
              questionsData: arrTemp,
              totalScore: (singleChoseScore + multipleChoseTotalScore + judgeTotalScore + gapFillingTotalScore + shortAnswerTotalScore + compositeTotalScore).toString(),
              totalSingleChose: parseInt(this.testActivity.singleChoseNum).toString(),
              totalMultipleChose: parseInt(this.testActivity.multipleChoseNum).toString(),
              totalJudge: parseInt(this.testActivity.judgeNum).toString(),
              totalGapFilling: parseInt(this.testActivity.gapFillingNum).toString(),
              totalShortAnswer: parseInt(this.testActivity.shortAnswerNum).toString(),
              totalComposite: parseInt(this.testActivity.compositeNum).toString(),
              singleChoiceScore: this.testActivity.singleChoiceScore.toString(),
              multipleChoiceScore: this.testActivity.multipleChoiceScore.toString(),
              judgeScore: this.testActivity.judgeScore.toString(),
              gapFilling: this.testActivity.gapFillingScore.toString(),
              shortAnswerScore: this.testActivity.shortAnswerScore.toString(),
              compositeScore: this.testActivity.compositeScore.toString(),
              paperName: this.testActivity.activityTitle,
              answerTime: this.testActivity.timeRuns.toString(),
              //answerTime: "1",
              paperIsRandom: this.testActivity.isOutOrder,
              redoNum: redoNum.toString(),
              viewResultTime: this.testActivity.lookAnswerTime,
              resgroupId: this.testActivity.resgroupId,
              gapFillingScoreStandard: this.testActivity.gapFillingScoreStandard,
            };

            this.$api.activityTest.saveTestPaperInfo(obj).then(res => {
              toast(res.msg);
              if (res.code === 0) {
                this.goToPageActivityList();
              }
              toast(res.msg);
              this.isViewSave = false;
            })
          },
          //编辑题目时的导航操作
          handleTabsEdit(targetName, action) {
            if (action === 'add') {
              if (!this.questionsData[this.questionsData.length - 1].questionsName) {
                toast("有题目未添加，不允许新增");
                return false;
              }
              this.questionsData.push({
                questionsId: '',
                questionsName: '',
                questionsType: '',
                questionsTypeName: '',
                replyIds: '',
                optionList:[
                  {code:'A'},
                  {code:'B'},
                  {code:'C'},
                  {code:'D'},
                ]
              });
              this.editableTabsValue = (this.questionsData.length - 1) + '';
            }
            if (action === 'remove') {
              if (this.questionsData.length <= 1) {
                return false;
              }
              let arrInt = parseInt(targetName);
              this.questionsData.splice(arrInt,1);
              this.editableTabsValue = (this.questionsData.length - 1) + '';
              this.getAllQuestionTypeNum();
            }
          },
          //题目新增修改退出事件
          handleClose(done) {
            let that = this;
            this.$confirm('确认关闭？')
              .then(_ => {
                that.dialogVisible = false;
                that.creatorIsEdit = false;
                //that.$refs.editorQuestion.initDataForm();
              })
              .catch(_ => {});
          },
          //点击新增题目事件
          handleAddQuestion(){
            this.isAdd = true;
            this.dialogTitle = '新增题目';
            this.dialogVisible = true;
            this.creatorIsEdit = false;
            if (this.$refs.editorQuestion) {
              this.$refs.editorQuestion.questionDataAddInit();
              this.$refs.editorQuestion.questionDataInit({isEdit:false});
            }
          },
          //打开题库选择题目弹窗
          handleAddQuestionBank(){
            // this.questionsData.forEach(item => {
            //   if (item.questionsType === "1" && item.questionsId) {
            //     console.log(this.topicData)
            //   }
            // })
            this.isShowDialog = true;
          },
          //确定题库选择的题目
          submitAddQuestionBank(){
            let arr = [];
            for (let index = 0; index < this.topicData.length; index++) {
              let obj = {
                chapterId: this.topicData[index].chapterId,
                singleChoseNum: this.topicData[index].totalSingleChoseInput,
                multipleChoseNum: this.topicData[index].totalMultipleChoseInput,
                judgeNum: this.topicData[index].totalJudgeInput,
                gapFillingNum: this.topicData[index].totalGapFillingInput,
                shortAnswerNum: this.topicData[index].totalShortAnswerInput,
                compositeNum: this.topicData[index].totalCompositeInput,
                type:  this.topicData[index].type,
              }
              arr.push(obj);
            }
            this.$api.activityTest.loadCombinationPaper(arr).then(res => {
              if (res.code === 0) {
                if (res.questionsMap.code && res.questionsMap.code === 500) {
                  toast(res.questionsMap.msg)
                  return false
                }
                this.choiceQuestions = res.questionsMap.choiceQuestions;
                this.judgeQuestions = res.questionsMap.judgeQuestions;
                this.gapFillingQuestions = res.questionsMap.gapFillingQuestions;
                this.shortAnswerQuestions = res.questionsMap.shortAnswerQuestions;
                this.compositeQuestions = res.questionsMap.compositeQuestions;
                if (this.compositeQuestions.length > 0) {
                  this.compositeQuestions.forEach((item) => {
                    item.questionList = item.children;
                  })
                }
                //this.$refs.question.getPaperslist();


                if (this.choiceQuestions.length + this.judgeQuestions.length + this.gapFillingQuestions.length + this.shortAnswerQuestions.length + this.compositeQuestions.length > 0) {
                  this.questionsData.splice(this.questionsData.length - 1,1);
                  this.questionsData = this.questionsData.concat(this.choiceQuestions);
                  this.questionsData = this.questionsData.concat(this.judgeQuestions);
                  this.questionsData = this.questionsData.concat(this.gapFillingQuestions);
                  this.questionsData = this.questionsData.concat(this.shortAnswerQuestions);
                  this.questionsData = this.questionsData.concat(this.compositeQuestions);
                  this.getAllQuestionTypeNum();
                  this.isShowDialog = false;
                  this.$refs.tree.setCheckedKeys([]);
                  this.topicData = [];
                  toast("新增题目成功")
                }else{
                  toast("请选择题目个数");
                }
              }else{
                toast(res.msg);
              }
            })
          },
          //编辑已添加的题目
          editQuestioInit(){
            if (!this.isAdd) {
              let obj = JSON.parse(JSON.stringify(this.questionsData[parseInt(this.editableTabsValue)]));

              if (obj.questionList && obj.questionList.length > 0) {
                obj.children = [ ...obj.questionList ]
              }
              this.creatorIsEdit = true
              obj.isEdit = true
              this.$refs.editorQuestion.questionDataInit(obj);
            }
          },
          //点击
          handleEditQuestion(){
            this.isAdd = false;
            this.creatorIsEdit = true;
            this.dialogTitle = '编辑题目';
            this.dialogVisible = true;
          },
          //保存自主新增的题目
          handleSave(){
            let obj = this.$refs.editorQuestion.toSave();
            if (obj) {
              if (this.isAdd) {
                this.questionsData[this.questionsData.length - 1] = obj;
                toast("新增题目成功")
              }else{
                this.questionsData[parseInt(this.editableTabsValue)] = obj;
                toast("编辑题目成功")
              }
              this.getAllQuestionTypeNum();
              this.dialogVisible = false;
              //this.$refs.editorQuestion.initDataForm();
            }
          },
          //获取其父级以及其自己的章节id
          getChapterIdList(arr,chapterId){
              arr.forEach((item,index) => {
                  if (item.chapterId === chapterId) {
                      this.testActivity.chapterId.unshift(item.parentId);
                      this.getChapterIdList(this.zNodes,item.parentId)
                  }
                  if (item.children && item.children.length > 0) {
                      this.getChapterIdList(item.children,chapterId);
                  }
              })
          },
        },
        created () {
          // 活动分组
          //this.getListActivityGroup();
          //获取章节目录
          let params = {
            pkgId: this.pkgId,
            subjectId: this.subjectId
          }
          this.$api.pkgInfo.getBookTreeData(params).then((res) => {
            if (res.code == 0) {
              //this.zNodes.push(res.data);
              this.zNodes = res.data.children;
              if (this.chapterId) {
                  this.testActivity.chapterId = [];
                  this.testActivity.chapterId.push(this.chapterId);
                  this.getChapterIdList(this.zNodes,this.chapterId);
                  this.testActivity.chapterId.splice(0,1);
              } else {
                  this.disabledSelectTree = false
              }
            }
          });
          // 是否选中章节
          // if (this.chapterId) {
          //   this.testActivity.chapterId = this.chapterId;
          //   //this.disabledSelectTree = true
          // } else {
          //   this.disabledSelectTree = false
          // }
          //获得章节数据
          this.getTopicTypeData();
        },
    }
</script>

<style scoped>
  /* 返回 */
  .classroom-back{
    text-align: right;
    font-size: 14px;
    cursor: pointer;
    color: #158aeb;
    margin-right: 20px;
  }
  .classroom-back-icon{
    font-size: 14px;
    margin-right: 5px
  }
  /* 当前位置 */
  .present-localtion{
    width: 100%;
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    text-align: left;
    padding-left: 15px;
    display: flex;
    justify-content: space-between;
  }
  .present-localtion-title{
    color: #959da0;
  }
  /* 手势动作 */
  .cursor{
    cursor: pointer;
  }
  /* 选择题目区域样式 */
  .test-question-right-center{
    max-height: 400px;
    overflow-y: scroll;
  }
  .question-num{
    display: flex;
    justify-content: space-around;
  }
  .topic-type{
    width: 20%;
    height: 100%;
  }
  .topic-choose{
    width: 80%;
    height: 100%;
  }
  .topicInput{
    width: 40%;
    border: 1px solid #ced4da;
    outline: none;
    border-radius: 2px;
  }
  .del-icon:hover+.topic-name{
    color: red;
  }
  .del-icon:hover{
    color: red;
  }
  .choose-title{
    height: 49px;
    line-height: 49px;
    padding-left: 10px;
    text-align: left;
    border-bottom: 1px solid #EBEEF5;
    color: #909399;
    font-weight: bold;
  }
  .choose-content{
    height: 348px;
    overflow: scroll;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  }

  input[ type= "number" ] {
  -moz-appearance: textfield;
  }
  /* 步骤条样式 */
  .article-steps{
    padding: 40px 0 10px;
  }
  /* 回底部样式 */
  .back-top{
    position: fixed;
    bottom: 100px;
    left: calc(((100vw - 1200px) / 2 + 1200px + 20px));
    cursor: pointer;
  }
  /* 题目显示样式 */
  .question-area{
    width: 100%;
    border-bottom: 1px solid #bbbbbb;
    border-left: 1px solid #bbbbbb;
    border-right: 1px solid #bbbbbb;
    margin: 0 auto;
    min-height: 400px;
  }
  .question-btn-area{
    text-align: right;
    padding: 10px 20px 10px 0;
  }
  .quesList > .list-item{
      position: relative;
      list-style:none;
      background-color: #FFF;
      padding: 15px 15px 0 15px;
      margin-bottom: 12px;
      text-align: left;
  }
  .list-item .queHint{
      color: #666A75;
      font-size: 20px;
      text-align: center;
  }
  .list-item .queHint span{
      margin-top: 30px;
  }
  .list-item .quesDiffculty-box{
      position: absolute;
      top:0;
      right:0;
      width: 80px;
      height: 44px;
      overflow: hidden;
  }
  .list-item .quesDiffculty{
      position: absolute;
      top: 0;
      right:-20px;
      width: 80px;
      height: 18px;
      /* background-color: #2ed5ac; */
      text-align: center;
      line-height:18px;
      padding-left: 15px;
      color: #FFFFFF;
      transform: rotate(45deg);

  }
  .list-item .type{
      display: inline-block;
      /* width: 50px; */
      padding: 0 5px;
      height: 20px;
      line-height: 20px;
      border-radius: 10px;
      color: #fff;
      font-size: 12px;
      text-align: center;
      /* background-color: #9B30FF; */
  }
  .list-item .options{
      margin-top:30px;
      /* display: flex;
      justify-content: space-between; */
  }
  .list-item .options >p{
      width: 50%;
      line-height: 1.5;
      overflow: hidden;
      padding-right: 15px;
      padding-bottom: 10px;
      margin-left: 0;
      float: left;
      transition: all .5s;
      word-break: break-all;
  }
  /* .v-enter-active,
    .v-leave-active{
        will-change: transform;
        transition: all 2s;
        position: absolute;
        width:100%;
        left:0;
    }
    .v-enter {
        transform: translateX(-100%);
    }
    .v-leave-active {
        transform: translateX(100%);
    } */
    /* element导航的样式 */
    .question-tabs /deep/ .el-tabs__header{
      margin: 0 !important;
    }
    .question-tabs /deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav{
      border: 1px solid #bbbbbb !important;
      border-bottom: none !important;
      border-left: none !important;
    }
    .question-tabs /deep/ .el-tabs--card>.el-tabs__header{
      border-bottom: 1px solid #bbbbbb !important;
    }
    .question-tabs /deep/ .el-tabs--card>.el-tabs__header .el-tabs__item{
      border-left: 1px solid #bbbbbb !important;
    }
    .question-tabs /deep/ .el-tabs__new-tab{
      border: 2px solid #409eff;
      height: 30px;
      width: 30px;
      padding-top: 1px;
      /* margin: 12px 0 9px 10px; */
      margin: 5px 0 0 0;
      border-radius: 3px;
      text-align: center;
      font-size: 25px;
      color: #bbbbbb;
      cursor: pointer;
      transition: all .15s;
    }
    .question-tabs /deep/ .el-icon-plus:before{
      color: #409eff;
    }
    /deep/ .saveTestDialogClass{
      height: 75vh;
      overflow: auto;
    }
</style>
