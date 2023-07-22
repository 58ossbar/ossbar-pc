<!-- 题库的 试题库页面 -->
<template>
    <div class="question-pagers-wrapper">
      <div style="text-align: right;margin: 15px 50px 0 0;" v-show="papersType === '2' && isShowAddBtns && isEdit && paperslist[0].children.length === 0 && paperslist[1].children.length === 0 && paperslist[2].children.length === 0 && paperslist[3].children.length === 0 && paperslist[4].children.length === 0">
        <el-button type="primary" size="mini" @click="dialogVisible = true">题库新增题目</el-button>
        <el-button type="primary" size="mini" @click="handleAddQuestion">编写题目</el-button>
      </div>
      <div class="papers-name" v-if="papersType !== '2' || isOrganizingPreviewPaper">
        <span v-if="textInfo.paperName">{{textInfo.paperName}}</span>
        <span v-else-if="isOrganizingPreviewPaper">试卷名称</span>
      </div>
      <div class="papers-time-nums-wrapper" v-if="papersType !== '2' || isOrganizingPreviewPaper">
        <div class="papers-time">时间：{{textInfo.paperConfinementTime !== 0 ? (textInfo.paperConfinementTime + '分钟') : '不限时'}}</div>
        <div>总分：{{textInfo.TotalScore}}分</div>
      </div>
      <div v-if="paperslist && paperslist.length > 0">
        <div v-for="(itemp, indexp) in paperslist" :key="indexp" class="pages-list-wrapper">

          <!-- 选择题、判断题的标识和题目数显示、新增题目操作begin -->
          <div class="papers-type" v-if="itemp.children && itemp.children.length > 0">
            <div class="papers-type-name" v-if="indexp !== 2"> {{itemp.name}} <span v-if="papersType !== '2'">（<span>共{{itemp.num}}</span>{{indexp === 4 ? '大' : ''}}题 {{indexp === 4 ? '大题中' : ''}}每{{indexp === 4 ? '小' : ''}}题{{indexp !== 2 && itemp.children[0].questionsScore ? itemp.children[0].questionsScore : itemp.children[0].maxScore}}分）</span></div>
            <div class="papers-type-name" v-if="indexp === 2"> {{itemp.name}} <span>（<span>共{{itemp.num}}</span>题 每空{{itemp.children[0].questionsScore}}分）</span></div>
            <div style="padding: 5px 0;margin-right: 40px;" v-if="(indexp === 0 || paperslist[0].children.length === 0) && papersType === '2' && isEdit && isShowAddBtns">
              <el-button type="primary" size="mini" @click="dialogVisible = true">题库新增题目</el-button>
              <el-button type="primary" size="mini" @click="handleAddQuestion">编写题目</el-button>
            </div>
          </div>
          <!-- 选择题、判断题的标识和题目数显示、新增题目操作end -->
          
          <ul class="quesList" v-if="itemp.children && itemp.children.length > 0">
              <li class="list-item mouse_style" v-for="(topic,topicaIndex) in itemp.children" :key="topicaIndex" :id=" indexp === 0 ? ('judgeQuestion' + topicaIndex) : (indexp === 1 ? ('choiceQuestion' + topicaIndex) : ( indexp === 2 ? ('gapFillingQuestion' + topicaIndex) : ( indexp === 3 ? ('shortAnswerQuestion' + topicaIndex) : ('compositeQuestion' + topicaIndex))))">
                  
                  <!-- 右上角操作 -->
                  <!-- <div class="quest-menu-box" v-if="papersType === '2' && !isShowOperation && isEdit">
                      <i class="icon iconfont icon-jiantouarrowhead7" style="color:#ccc"></i>
                      <ul class="ques-menu">
                          <li @click="reelectTopic(topic)" v-if="topic.questionsId">重选</li>
                          <li @click="editQuestion(topic,topicaIndex)" v-if="!topic.questionsId">编辑</li>
                          <li @click="delTopic(topic)">删除</li>
                      </ul>
                  </div> -->
                  <el-dropdown class="list-item-dropdown" @command="handleCommand($event,topic,topicaIndex)" v-if="papersType === '2' && !isShowOperation && isEdit">
                    <span class="el-dropdown-link">
                      <i class="el-icon-arrow-up el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown" class="list-item-dropdown-menu">
                      <el-dropdown-item v-if="topic.questionsId" command="reelect">重选</el-dropdown-item>
                      <el-dropdown-item v-if="!topic.questionsId || topic.hasEditPermission" command="edit">编辑</el-dropdown-item>
                      <el-dropdown-item command="del">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  
                  <!-- 题目 -->
                  <div class="question" style="margin-top:5px;display:flex;" @click="handleHtml($event)">
                      <span class="num" style="font-size: 16px;font-weight: bold;">{{topicaIndex+1}}.</span>
                      <span class="question-type">{{topic.questionsTypeName}}</span>
                      <span :class="['list-questions-name ', isOrganizingPreviewPaper?'list-questions-name-organizing':'']" v-html="topic.questionsName"></span>
                  </div>

                  <!-- 非复合题显示 -->
                  <div v-if="indexp !== 4">

                    <!-- 判断题选项 -->
                    <div v-if="indexp === 0 && papersType !== '2'" class="papers-select-wrapper">
                      <span class="papers-select-label">请选择：</span>
                      <el-radio-group :class="[(papersType === '0' && topic.isCorrect === 'Y') ? 'correct-test-question' : ((papersType === '0' && topic.isCorrect === 'N') ? 'error-test-question' : '')]" :disabled="papersType === '0'" v-model="answer.judgeAnswer[topicaIndex].replyIds" @change="handleOption">
                        <el-radio v-for="(item0, index0) in topic.optionList" :key="index0" :label="item0.optionId">{{item0.content}}</el-radio>
                      </el-radio-group>
                    </div>

                    <!-- 选择题选项 -->
                    <div class="options" v-if="((papersType === '0' && indexp !== 2) || (papersType !== '0' && indexp === 1)) &&  topic.optionList && topic.optionList.length > 0" >
                        <p v-for="option in topic.optionList" :key="option.optionId" style="display: flex" @click="handleHtml($event)">
                            <b style="margin-right:5px;">{{option.code}}.</b>
                            <span style="word-wrap:break-word;" v-html="option.content"></span>
                        </p>
                        <div style="clear:both;"></div>
                    </div>

                    <!-- 选择题正确选项选择 -->
                    <div v-if="papersType !== '2' && indexp === 1" class="papers-select-wrapper">
                      <span class="papers-select-label">请选择：</span>
                      <!-- 单选 -->
                      <el-radio-group :class="[(papersType === '0' && topic.isCorrect === 'Y') ? 'correct-test-question' : ((papersType === '0' && topic.isCorrect === 'N') ? 'error-test-question' : '')]" :disabled="papersType === '0'" v-if="topic.questionsType === '1'" v-model="answer.choiceAnswer[topicaIndex].replyIds" @change="handleOption">
                        <el-radio v-for="(item0, index0) in topic.optionList" :key="index0" class="test-question-option-checkbox" :label="item0.optionId">{{item0.code}}</el-radio>
                      </el-radio-group>
                      <!-- 多选 -->
                      <el-checkbox-group :class="[(papersType === '0' && topic.isCorrect === 'Y') ? 'correct-test-question' : ((papersType === '0' && topic.isCorrect === 'N') ? 'error-test-question' : '')]" :disabled="papersType === '0'" v-if="topic.questionsType === '2'" v-model="answer.choiceAnswer[topicaIndex].replyIds" @change="handleOption">
                        <el-checkbox v-for="(item0, index0) in topic.optionList" :key="index0" class="test-question-option-checkbox" :label="item0.optionId">{{item0.code}}</el-checkbox>
                      </el-checkbox-group>
                    </div>

                    <!-- 填空题作答 -->
                    <div class="gap-filling-wrapper" v-if="indexp === 2 && papersType !== '2'">
                        <div class="gap-filling-answer" v-for="(item2) in topic.gapFillingNumber" :key="item2">
                            <div class="gap-filling-title">
                              填空{{item2}}：
                            </div>
                            <el-input v-model="answer.gapFillingAnswer[topicaIndex].gapFillingList[item2 - 1].content" placeholder="请输入内容" :disabled="papersType === '0'"></el-input>
                        </div>
                        <div class="textAlignRight" v-if="papersType === '0' && !isInTheTest">
                          <el-button v-if="textInfo.hasPermission" type="primary" size="small" @click="fillingCorrectClick(topic)">修正</el-button>
                          <el-button v-if="textInfo.hasPermission" type="primary" size="small" @click="showCorrectClick(topic)">查看修正记录</el-button>
                        </div>
                    </div>

                    <!-- 简答题作答 -->
                    <div class="short-answer-write" v-if="indexp === 3 && papersType !== '2'">
                      <el-input
                        :disabled="papersType === '0'"
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 6}"
                        placeholder="请作答"
                        v-model="answer.shortAnswerAnswer[topicaIndex].content">
                      </el-input>
                      <div class="short-answer-score" v-if="papersType === '0' && !isInTheTest">
                        <div style="line-height: 28px;">分值：</div>
                        <input :disabled="!textInfo.hasPermission" placeholder="未打分" type="number" style="width: 55px;margin-right:20px;" v-model="topic.userScore" class="topicInput" min="0" max="10" :oninput="'if(value>' + topic.maxScore + ')value=' + topic.maxScore + ';if(value.length>' + topic.maxScore.length + ')value=value.slice(0,' + topic.maxScore.length + ')'" onkeyup="this.value=this.value.replace(/\D/g,'')">
                        <el-button v-if="textInfo.hasPermission" type="primary" size="small" @click="handleAnswerScore(topic)">打分</el-button>
                      </div>
                    </div>

                    <!-- 题目解析 -->
                    <div class="answer" v-show="papersType !== '1' && ((indexp === 1 &&answer.choiceAnswer[topicaIndex].showAnalysis) || (indexp === 0 && answer.judgeAnswer[topicaIndex].showAnalysis) || (indexp === 3 && answer.shortAnswerAnswer[topicaIndex].showAnalysis)|| (indexp === 2 && answer.gapFillingAnswer[topicaIndex].showAnalysis))">
                        <div class="answerCon">
                            <div class="baseOrange displayFlex2" style="isplay: block;margin-bottom: 10px;">
                              <span>正确答案：</span>
                              <div v-if="topic.optionList && topic.optionList.length > 0 && topic.questionsType !== '5'" class="displayFlex2">
                                <div v-for="(item1, index1) in topic.optionList" :key="'optionList'+index1" class="displayFlex2">
                                  <span v-if="item1.isModelAnswer" >{{topic.questionsType !== '3' ? item1.code : ('A' === item1.code ? '对' : '错')}}</span>
                                  <span v-else-if="item1.isRight && item1.isRight !== 'NO'" >{{topic.questionsType !== '3' ? item1.code : ('A' === item1.code ? '对' : '错')}}</span>
                                </div>
                              </div>
                              <div v-else-if="topic.optionList && topic.optionList.length > 0 && topic.questionsType === '5'">
                                <div v-for="(item1, index1) in topic.optionList" :key="'optionList'+index1">
                                  填空{{index1 + 1}}：{{item1.content}}
                                </div>
                              </div>
                            </div>
                            <div class="displayFlex2">
                              <p style="color: #FF3E96;margin-bottom: 10px;">题目解析：</p>
                              <div class="analysis" style="word-wrap:break-word;width:90%;" @click="handleHtml($event)">
                                <p v-html="topic.questionsParse"></p>
                              </div>
                            </div>
                        </div>
                    </div>

                    <div class="bottomTab" v-if="papersType !== '1'">
                        <!-- <div>组卷次数：<span class="baseOrange">{{topic.questionsConstructingNum}}</span></div>
                        <div>正确率：<span class="baseOrange">{{topic.questionsAccuracy}}%</span></div> -->
                        <div style="text-align:right;">
                            <a href="javascript:void(0)"  @click="showAnalysisCon($event,topicaIndex,indexp)">
                            <i class="analysis iconfont icon-chakan" style="font-size:20px;left:-25px;"></i>查看解析
                            </a>
                        </div>
                    </div>

                  </div>
                  
                  <!-- 复合题显示 -->
                  <div v-if="indexp === 4" style="margin-top:30px;">
                    <div v-for="(topic0, topic0Index) in topic.questionList" :key="topic0Index" style="padding-left:50px;">
                      <!-- 题目 -->
                      <div class="question" style="margin-top:5px;display:flex;" @click="handleHtml($event)">
                          <span class="num" style="font-size: 16px;">({{topic0Index+1}})</span>
                          <span class="question-type">{{topic0.questionsTypeName}}</span>
                          <span style="margin: 0 0 10px;overflow-wrap: break-word;width: 91%;word-break: break-all;" v-html="topic0.questionsName"></span>
                      </div>

                      <!-- 判断题选项 -->
                      <div v-if="topic0.questionsType === '3' && papersType !== '2'" class="papers-select-wrapper">
                        <span class="papers-select-label">请选择：</span>
                        <el-radio-group :class="[(papersType === '0' && topic0.isCorrect === 'Y') ? 'correct-test-question' : ((papersType === '0' && topic0.isCorrect === 'N') ? 'error-test-question' : '')]" :disabled="papersType === '0'" v-model="answer.compositeAnswer[topicaIndex].answer[topic0Index].replyIds" @change="handleOption">
                          <el-radio v-for="(item0, index0) in topic0.optionList" :key="index0" :label="item0.optionId">{{item0.content}}</el-radio>
                        </el-radio-group>
                      </div>

                      <!-- 选择题选项 -->
                      <div class="options" style="margin-top:0;" v-if="((papersType === '0' && topic0.questionsType  !== '5') || (papersType !== '0' && (topic0.questionsType  === '1' || topic0.questionsType  === '2'))) &&  topic0.optionList && topic0.optionList.length > 0" >
                          <p v-for="option in topic0.optionList" :key="option.optionId" style="display: flex" @click="handleHtml($event)">
                              <b style="margin-right:5px;">{{option.code}}.</b>
                              <span style="word-wrap:break-word;" v-html="option.content"></span>
                          </p>
                          <div style="clear:both;"></div>
                      </div>

                      <!-- 选择题正确选项选择 -->
                      <div v-if="papersType !== '2' && (topic0.questionsType  === '1' || topic0.questionsType  === '2')" class="papers-select-wrapper">
                        <span class="papers-select-label">请选择：</span>
                        <!-- 单选 -->
                        <el-radio-group :class="[(papersType === '0' && topic0.isCorrect === 'Y') ? 'correct-test-question' : ((papersType === '0' && topic0.isCorrect === 'N') ? 'error-test-question' : '')]" :disabled="papersType === '0'" v-if="topic0.questionsType === '1'" v-model="answer.compositeAnswer[topicaIndex].answer[topic0Index].replyIds" @change="handleOption">
                          <el-radio v-for="(item0, index0) in topic0.optionList" :key="index0" class="test-question-option-checkbox" :label="item0.optionId">{{item0.code}}</el-radio>
                        </el-radio-group>
                        <!-- 多选 -->
                        <el-checkbox-group :class="[(papersType === '0' && topic0.isCorrect === 'Y') ? 'correct-test-question' : ((papersType === '0' && topic0.isCorrect === 'N') ? 'error-test-question' : '')]" :disabled="papersType === '0'" v-if="topic0.questionsType === '2'" v-model="answer.compositeAnswer[topicaIndex].answer[topic0Index].replyIds" @change="handleOption">
                          <el-checkbox v-for="(item0, index0) in topic0.optionList" :key="index0" class="test-question-option-checkbox" :label="item0.optionId">{{item0.code}}</el-checkbox>
                        </el-checkbox-group>
                      </div>

                      <!-- 填空题作答 -->
                      <div class="gap-filling-wrapper" v-if="topic0.questionsType  === '5' && papersType !== '2'">
                          <div class="gap-filling-answer" v-for="(item2,index) in topic0.optionList" :key="index">
                              <div class="gap-filling-title">
                                填空{{index+1}}：
                              </div>
                              <el-input v-model="answer.compositeAnswer[topicaIndex].answer[topic0Index].gapFillingList[index].content" placeholder="请输入内容" :disabled="papersType === '0'"></el-input>
                          </div>
                          <div class="textAlignRight" v-if="papersType === '0' && !isInTheTest">
                          <el-button v-if="textInfo.hasPermission" type="primary" size="small" @click="fillingCorrectClick(topic0)">修正</el-button>
                          <el-button v-if="textInfo.hasPermission" type="primary" size="small" @click="showCorrectClick(topic0)">查看修正记录</el-button>
                        </div>
                      </div>

                      <!-- 简答题作答 -->
                      <div class="short-answer-write" v-if="topic0.questionsType  === '4' && papersType !== '2'">
                        <el-input
                          :disabled="papersType === '0'"
                          type="textarea"
                          :autosize="{ minRows: 4, maxRows: 6}"
                          placeholder="请作答"
                          v-model="answer.compositeAnswer[topicaIndex].answer[topic0Index].content">
                        </el-input>
                        <div class="short-answer-score" v-if="papersType === '0' && !isInTheTest">
                          <div style="line-height: 28px;">分值：</div>
                          <input :disabled="!textInfo.hasPermission" placeholder="未打分" type="number" style="width: 55px;margin-right:20px;" v-model="topic0.userScore" class="topicInput" min="0" max="10" :oninput="'if(value>' + topic.maxScore + ')value=' + topic0.maxScore + ';if(value.length>' + topic0.maxScore.length + ')value=value.slice(0,' + topic0.maxScore.length + ')'" onkeyup="this.value=this.value.replace(/\D/g,'')">
                          <el-button v-if="textInfo.hasPermission" type="primary" size="small" @click="handleAnswerScore(topic0)">打分</el-button>
                        </div>
                      </div>

                      <!-- 题目解析 -->
                      <div class="answer" 
                          v-show="papersType !== '1' 
                          && (((topic0.questionsType  === '1' || topic0.questionsType  === '2') && answer.compositeAnswer[topicaIndex].answer[topic0Index].showAnalysis) 
                          || (topic0.questionsType  === '3' && answer.compositeAnswer[topicaIndex].answer[topic0Index].showAnalysis) 
                          || (topic0.questionsType  === '4' && answer.compositeAnswer[topicaIndex].answer[topic0Index].showAnalysis)
                          || (topic0.questionsType  === '5' && answer.compositeAnswer[topicaIndex].answer[topic0Index].showAnalysis))">
                          <div class="answerCon">
                              <div class="baseOrange displayFlex2" style="isplay: block;margin-bottom: 10px;">
                                <span>正确答案：</span>
                                <div v-if="topic0.optionList && topic0.optionList.length > 0 && topic0.questionsType !== '5'" class="displayFlex2">
                                  <div v-for="(item1, index1) in topic0.optionList" :key="'optionList'+index1" class="displayFlex2">
                                    <span v-if="item1.isModelAnswer" >{{topic0.questionsType !== '3' ? item1.code : ('A' === item1.code ? '对' : '错')}}</span>
                                    <span v-else-if="item1.isRight && item1.isRight !== 'NO'" >{{topic0.questionsType !== '3' ? item1.code : ('A' === item1.code ? '对' : '错')}}</span>
                                  </div>
                                </div>
                                <div v-else-if="topic0.optionList && topic0.optionList.length > 0 && topic0.questionsType === '5'">
                                  <div v-for="(item1, index1) in topic0.optionList" :key="'optionList'+index1">
                                    填空{{index1 + 1}}：{{item1.content}}
                                  </div>
                                </div>
                              </div>
                              <div class="displayFlex2">
                                <p style="color: #FF3E96;margin-bottom: 10px;">题目解析：</p>
                                <div class="analysis" style="word-wrap:break-word;width:90%;" @click="handleHtml($event)">
                                  <p v-html="topic0.questionsParse"></p>
                                </div>
                              </div>
                          </div>
                      </div>

                      <div class="bottomTab" v-if="papersType !== '1'">
                          <!-- <div>组卷次数：<span class="baseOrange">{{topic.questionsConstructingNum}}</span></div>
                          <div>正确率：<span class="baseOrange">{{topic.questionsAccuracy}}%</span></div> -->
                          <div style="text-align:right;">
                              <a href="javascript:void(0)"  @click="showAnalysisCon($event,topicaIndex,indexp,topic0Index)">
                              <i class="analysis iconfont icon-chakan" style="font-size:20px;left:-25px;"></i>查看解析
                              </a>
                          </div>
                      </div>
                    </div>
                  </div>
              </li>
          </ul>
        </div>
      </div>

      <!-- 图片预览标签 -->
      <div class="accessory-viewer" v-viewer style="display: none;">
        <img  :src="imgSrc" alt>
      </div>

      <!-- 题目新增修改弹窗begin -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="isShowDialog"
        width="50%"
        @opened="editQuestioInit"
        custom-class="saveTestDialogClass"
        :before-close="handleClose">
        <creator-test-question v-if="isShowDialog" ref="editorQuestion" pagesType="1" :isEdit="creatorIsEdit"></creator-test-question>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button :loading="isViewSave" type="primary" @click="handleSave">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 题目新增修改弹窗end -->

      <!-- 新增试题弹出框begin -->
      <el-dialog
        title="新增试题"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="60%">
        <div style="text-align: left;padding-left: 15px">
          <div style="width: 95%;margin: 20px auto;text-align: left">选择测试题目</div>
          <div style="width: 95%;margin: 20px auto;">
            <div style="border: 1px #bbbbbb solid;height: 400px;display: flex;">
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
              </div>

        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 新增试题弹出框end -->

      <!-- 修正填空题 弹出框begin -->
      <el-dialog
        title="修正填空题"
        :visible.sync="correctDialog"
        :close-on-click-modal="false"
        width="30%">
        <el-form :model="correctForm" :rules="correctRules" ref="correctForm" label-width="90px" class="gap-filling-correct-Form">
          <el-form-item label="评分分值" prop="score">
            <!-- <el-input v-model.number="correctForm.score" :max="correctForm.maxScore" type="number" :min="0" :oninput="'if(value>' + correctForm.maxScore + ')value=' + correctForm.maxScore + ';if(value.length>' + correctForm.maxScore.length + ')value=value.slice(0,' + correctForm.maxScore.length + ')'" ></el-input> -->
            <el-input-number v-model="correctForm.score" controls-position="right" :min="0" :max="correctForm.maxScore" :precision="2" style="width: 100%;"></el-input-number>
          </el-form-item>
           <el-form-item label="修正原因" prop="reason">
            <el-input type="textarea" v-model="correctForm.reason" :rows="4" resize="none" maxlength="500" clearable></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCorrectCancel">取 消</el-button>
          <el-button type="primary" :loading="correctLoading" @click="handleCorrectSubmitForm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修正填空题 弹出框end -->
       <!-- 修正填空题 弹出框begin -->
      <el-dialog
        title="查看修正记录"
        :visible.sync="correctListDialog"
        :before-close="function (){ correctListDialog = false }"
        width="50%">
              <!-- :header-cell-style="{background:'#F3F4F7',color:'#555'}"
              height="288px" -->
        <el-table :data="correctList" stripe style="width: 100%" height="288px">
          <el-table-column
            prop="createTime"
            label="时间"
            width="160"/>
          <el-table-column
            prop="score"
            label="评分分值"
            width="80"/>
          <el-table-column
            prop="reason"
            align="center"
            show-overflow-tooltip
            label="修正原因"/>
        </el-table>
      </el-dialog>
      <!-- 修正填空题 弹出框end -->
    </div>
</template>
<script>
import App from '../../App.vue';
import { toast, preventBackgroundScrolling } from '@/utils/global';
import CreatorTestQuestion from '@/components/cb-creator-question/creator-test-question';
export default {
  name: 'cb-question-papers',
  components: {
    App,
    "creator-test-question":CreatorTestQuestion
  },
  props: {
    isShowAddBtns: { // 是否显示题目新增按钮
      type: Boolean,
      default: true
    },
    isOrganizingPreviewPaper: { // 是否是教师组卷预览界面
      type: Boolean,
      default: false
    },
    papersType: { // 试卷的类型 '0'是查看回答，'1'是学员作答，'2'是老师预览
      type: String,
      default: '0'
    },
    //新增题目时的章节数据
    topicTypeData: {
      type: Array,
      required: false,
      default: ()=> []
    },
    //选择题
    choiceQuestions: {
      type: Array,
      default: ()=> []
    },
    //判断题
    judgeQuestions: {
      type: Array,
      default: ()=> []
    },
    //填空题
    gapFillingQuestions: {
      type: Array,
      default: ()=> []
    },
    //简答题
    shortAnswerQuestions: {
      type: Array,
      default: ()=> []
    },
    //复合题
    compositeQuestions: {
      type: Array,
      default: ()=> []
    },
    //试卷信息
    textInfo: {
      type: Object,
      required: false,
    },
    //答题信息
    answer: {
      type: Object,
      required: false,
      default: ()=> {
        return {
          judgeAnswer: [],
          choiceAnswer: [], 
          gapFillingAnswer: [],
          shortAnswerAnswer: [],
          compositeAnswer: [],
        }
      }
    },
    //在章节中考试  题目跳转，根据页面计算滚动条计算
    isInTheChapter:{
      type: Boolean,
      required: false,
      default: false
    },
    //在试卷库中考试  题目跳转，根据页面计算滚动条计算
    isInTheTest:{
      type: Boolean,
      required: false,
      default: false
    },
    //历史答题缓存信息
    historyAnswers:{
      type: Array,
      required: false,
      default: ()=> []
    },
    subjectId: {
      type: String,
      required: false,
      default: ''
    },
    //隐藏右上角操作
    isShowOperation: {
      type: Boolean,
      required: false,
      default: false
    },
    //隐藏右上角操作
    isEdit: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      correctList: [],
      correctListDialog: false,
      correctForm: {
        score: 0,
        reason: '',
        scoreId: '',
        ctId: '',
        maxScore: 0
      },
      correctRules: {
        score: [
          { required: true, message: '请输入评分分值', trigger: ['blur', 'change'] }
        ],
        reason: [
          { required: true, message: '请填写修正原因', trigger: ['blur', 'change'] }
        ]
      },
      correctLoading: false,
      correctDialog: false,
      // papersType: '2', // 试卷的类型 '0'是查看回答，'1'是学员作答，'2'是老师预览
      paperslist: [
        {name: '判断题', num: 0, children: []},
        {name: '选择题', num: 0, children: []},
        {name: '填空题', num: 0, children: []},
        {name: '简答题', num: 0, children: []},
        {name: '复合题', num: 0, children: []},
      ],  // 试题的数组
      dialogVisible: false,   //是否打开新增试题弹出框
      topicData: [],    //题目选择
      dialogTitle: '新增题目',  //弹出框标题
      isShowDialog: false,    //是否打开自主新增题目弹出框
      isAdd: false,           //true为自主新增题目 false为自主编辑 
      currQuestion: {},     //当前操作的题目对象
      currIndex: 0,         //当前操作的题目下标
      imgSrc: '',           //考试学员头像
      input: '',
      creatorIsEdit: false, //是否是自主的编辑题目操作 
      isViewSave: false,
    }
  },
  watch: {
    dialogVisible (val) {
      preventBackgroundScrolling(val)
    },
    isShowDialog (val) {
      preventBackgroundScrolling(val)
    },
    // 监听题目的改变，重新渲染题目
    judgeQuestions (newValue, oldValue) {
      this.getPaperslist();
    },
    choiceQuestions (newValue, oldValue) {
      this.getPaperslist();
    },
    shortAnswerQuestions (newValue, oldValue) {
      this.getPaperslist();
    },
    gapFillingQuestions (newValue, oldValue) {
      this.getPaperslist();
    },
    compositeQuestions (newValue, oldValue) {
      this.getPaperslist();
    },
  },
  created () {
  },
  mounted () {
    this.getPaperslist();
  },
  
  methods: {
    handleCorrectSubmitForm() {
      this.$refs.correctForm.validate((valid) => {
        if (valid) {
          this.correctLoading = true
          this.correctForm.ctId = this.textInfo.ctId
          this.$api.activityTest.saveScoreGapAmend(this.correctForm).then(res => {
            this.correctLoading = false
            toast(res.msg)
            if (res.code == 0) {
              this.handleCorrectCancel()
              this.$parent.getTopicInfo();
            }
          }).catch(() => {
            this.correctLoading = false
          })
        } else {
          return false;
        }
      });
    },
    fillingCorrectClick(obj) {
      this.correctDialog = true
      this.correctForm.maxScore = obj.maxScore
      this.correctForm.scoreId = obj.scoreId
    },
    showCorrectClick(obj) {
      this.correctListDialog = true
      this.correctList = obj.scoreLogList || []
    },
    handleCorrectCancel() {
      this.correctDialog = false
      this.$refs.correctForm.resetFields();
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
    //自主编写题目操作
     handleAddQuestion(){
      this.isAdd = true;
      this.dialogTitle = '新增题目';
      this.isShowDialog = true;
      this.creatorIsEdit = false;
      if (this.$refs.editorQuestion) {
        this.$refs.editorQuestion.questionDataAddInit();
        this.$refs.editorQuestion.questionDataInit({isEdit:false});
      }
    },
    //编辑操作
    editQuestion(obj,index){
      this.currQuestion = obj;
      if (this.currQuestion && this.currQuestion.questionList && this.currQuestion.questionList.length > 0) {
        this.currQuestion.children = [ ...this.currQuestion.questionList ]
      }
      this.currIndex = index;
      this.isAdd = false;
      this.creatorIsEdit = true;
      this.dialogTitle = '编辑题目';
      this.isShowDialog = true;
    },
    //编辑已添加的题目
    editQuestioInit(){
      this.isViewSave = false;
      if (!this.isAdd) {
        let obj = JSON.parse(JSON.stringify(this.currQuestion)); 
        obj.isEdit = true
        this.$refs.editorQuestion.questionDataInit(obj);
      }
    },
    //关闭自主编辑弹窗操作
    handleClose(done) {
      let that = this;
      this.$confirm('确认关闭？')
        .then(_ => {
          that.isShowDialog = false;
        })
        .catch(_ => {});
    },
    //保存自主新增的题目
    handleSave(){
      const that = this
      let obj = this.$refs.editorQuestion.toSave();
      if (obj) {
        this.isViewSave = true;
      }
      if (obj) {
        if (this.isAdd) {
          this.isShowDialog = false;
          if(obj.questionsType === '1' || obj.questionsType === '2'){
            this.choiceQuestions.push(obj);
          }
          if(obj.questionsType === '3'){
            this.judgeQuestions.push(obj);
          }
          if(obj.questionsType === '4'){
            this.shortAnswerQuestions.push(obj);
          }
          if(obj.questionsType === '5'){
            this.gapFillingQuestions.push(obj);
          }
          if(obj.questionsType === '6'){
            this.compositeQuestions.push(obj);
          }
          this.isViewSave = false;
          toast("新增题目成功");
        }else{

          let urlName = 'saveQuestion'
          if (obj.questionsType && obj.questionsType === '6') {
            urlName = 'saveCompositeQuestionInfo'
          }
          that.$api.questionbank[urlName](obj).then((res) => {
            if (res.code === 0) {
              let objEditData = that.$refs.editorQuestion.toSaveByGetBackData(res.data);

              if(objEditData.questionsType === '1' || objEditData.questionsType === '2'){
                that.choiceQuestions[that.currIndex] = objEditData;
              }
              if(objEditData.questionsType === '3'){
                that.judgeQuestions[that.currIndex] = objEditData;
              }
              if(objEditData.questionsType === '4'){
                that.shortAnswerQuestions[that.currIndex] = objEditData;
              }
              if(objEditData.questionsType === '5'){
                that.gapFillingQuestions[that.currIndex] = objEditData;
              }
              if(objEditData.questionsType === '6'){
                that.compositeQuestions[that.currIndex] = objEditData;
              }
              toast("修改题目成功");
              that.isShowDialog = false;
              that.isViewSave = false;

              
            } else {
              if (res.msg) {
                toast(res.msg)
              }
              that.isViewSave = false;
            }
          }).catch((err) => {
            if (err.msg) {
              toast(err.msg)
            }
            that.isViewSave = false;
          })
          // if(obj.questionsType === '1' || obj.questionsType === '2'){
          //   this.choiceQuestions[this.currIndex] = obj;
          // }
          // if(obj.questionsType === '3'){
          //   this.judgeQuestions[this.currIndex] = obj;
          // }
          // if(obj.questionsType === '4'){
          //   this.shortAnswerQuestions[this.currIndex] = obj;
          // }
          // if(obj.questionsType === '5'){
          //   this.gapFillingQuestions[this.currIndex] = obj;
          // }
          // if(obj.questionsType === '5'){
          //   this.compositeQuestions[this.currIndex] = obj;
          // }
          // toast("修改题目成功");
        }
      }
    },
    //新增试题的取消
    handleCancel(){
      this.topicData = [];
      this.$refs.tree.setCheckedKeys([]);
      this.dialogVisible = false;
    },
    //新增试题的确定
    handleSubmit(){
      if (this.topicData.length > 0) {
        //获取需要新增的判断题选择题数目
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

            //this.$refs.question.getPaperslist();
            if (res.questionsMap.choiceQuestions.length + res.questionsMap.judgeQuestions.length + res.questionsMap.shortAnswerQuestions.length + res.questionsMap.gapFillingQuestions.length + res.questionsMap.compositeQuestions.length > 0) {
              for (let index = 0; index < res.questionsMap.judgeQuestions.length; index++) {
                let obj = {
                  optionId: res.questionsMap.judgeQuestions[index].optionId,
                  replyIds: ''
                }
                this.answer.judgeAnswer.push(obj);
                this.paperslist[0].children.push(res.questionsMap.judgeQuestions[index]);
              }
              
              for (let index = 0; index < res.questionsMap.choiceQuestions.length; index++) {
                let obj = {};
                if(res.questionsMap.choiceQuestions[index].questionsType === '1'){
                  obj = {
                    optionId: res.questionsMap.choiceQuestions[index].optionId,
                    replyIds: ''
                  }
                }else{
                  obj = {
                    optionId: this.choiceQuestions[index].optionId,
                    replyIds: []
                  }
                }
                this.answer.choiceAnswer.push(obj);
                this.paperslist[1].children.push(res.questionsMap.choiceQuestions[index]);
              }
              for (let index = 0; index < res.questionsMap.shortAnswerQuestions.length; index++) {
                let obj = {
                  optionId: res.questionsMap.shortAnswerQuestions[index].optionId,
                  replyIds: '',
                  content:'',
                }
                this.answer.shortAnswerAnswer.push(obj);
                this.paperslist[3].children.push(res.questionsMap.shortAnswerQuestions[index]);
              }

              for (let index = 0; index < res.questionsMap.gapFillingQuestions.length; index++) {
                let obj = {};
                let replyIds = [];
                for (let index0 = 0; index0 < res.questionsMap.gapFillingQuestions[index].optionList.length; index0++) {
                  replyIds.push({id:'',content:''});
                }
                obj = {
                  optionId: res.questionsMap.gapFillingQuestions[index].questionsId,
                  gapFillingList: replyIds,
                  questionsScore: res.questionsMap.gapFillingQuestions[index].questionsScore,
                  content:''
                }
                this.answer.gapFillingAnswer.push(obj);
                this.paperslist[2].children.push(res.questionsMap.gapFillingQuestions[index]);
              }

              res.questionsMap.compositeQuestions.forEach((item, index) => {
                let arrTemp = [];
                if (!item.children) {
                  item.questionList = [];
                }else{
                  item.questionList = item.children;
                }
                item.questionList.forEach((item0,index0) => {
                  let obj = {};
                  if (item0.questionsType === '1') {
                    obj = {
                      optionId: item0.questionsId ? item0.questionsId : '123',
                      replyIds: '',
                      content: ''
                    }
                  }
                  if (item0.questionsType === '2') {
                    obj = {
                      optionId: item0.questionsId ? item0.questionsId : '123',
                      replyIds: [],
                      content: ''
                    }
                  }
                  if (item0.questionsType === '3') {
                    obj = {
                      optionId: item0.questionsId ? item0.questionsId : '123',
                      replyIds: '',
                      content: ''
                    }
                  }
                  if (item0.questionsType === '4') {
                    obj = {
                      optionId: item0.questionsId ? item0.questionsId : '123',
                      replyIds: '',
                      content:''
                    }
                  }
                  if (item0.questionsType === '5') {
                    let replyIds = [];
                    if (item0.optionList) {
                      for (let index0 = 0; index0 < item0.optionList.length; index0++) {
                        replyIds.push({id:'',content:''});
                      }
                    }else{
                      for (let index0 = 0; index0 < item0.gapFillingNumber; index0++) {
                        replyIds.push({id:'',content:''});
                      }
                    }
                    
                    obj = {
                      optionId: item0.questionsId ? item0.questionsId : '123',
                      questionsScore: item0.questionsScore,
                      gapFillingList: replyIds,
                      content:''
                    }
                  }
                  arrTemp.push(obj);
                })
                let tempObj = {answer: arrTemp};
                this.answer.compositeAnswer.push(tempObj);
                this.paperslist[4].children.push(item);
              })

              this.topicData = [];
              this.$refs.tree.setCheckedKeys([]);
              this.dialogVisible = false;
              toast("新增题目成功")
            }else{
              toast("请选择题目个数");
            }
          }else{
            toast(res.msg);
          }
        })
      }else{
        toast("请选择章节题目");
      }
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
      //this.topicData = allObj.checkedNodes;
    },
    //题目选项选中改变事件
    handleOption(){
      if ('1' === this.papersType) {
        this.$parent.getAnswer(this.answer);
      }
    },
    //定位 
    toJudgeQuestion(index){
      let height = document.getElementById('judgeQuestion'+index).offsetTop;
      if (this.isInTheChapter) {
        this.$parent.toToSetScrollTop(height - 50);
      } else if (this.isInTheTest) {
        document.documentElement.scrollTop = height - 50;
      } else{
        document.documentElement.scrollTop = height + 70;
      }
    },
    toChoiceQuestion(index){
      let height = document.getElementById('choiceQuestion'+index).offsetTop;
      if (this.isInTheChapter) {
        this.$parent.toToSetScrollTop(height - 50);
      } else if (this.isInTheTest) {
        document.documentElement.scrollTop = height - 50;
      } else{
        document.documentElement.scrollTop = height + 70;
      }
    },
    toGapFillingQuestion(index){
      let height = document.getElementById('gapFillingQuestion'+index).offsetTop;
      if (this.isInTheChapter) {
        this.$parent.toToSetScrollTop(height - 50);
      } else if (this.isInTheTest) {
        document.documentElement.scrollTop = height - 50;
      } else{
        document.documentElement.scrollTop = height + 70;
      }
    },
    toShortAnswerQuestion(index){
      let height = document.getElementById('shortAnswerQuestion'+index).offsetTop;
      if (this.isInTheChapter) {
        this.$parent.toToSetScrollTop(height - 50);
      } else if (this.isInTheTest) {
        document.documentElement.scrollTop = height - 50;
      } else{
        document.documentElement.scrollTop = height + 70;
      }
    },
    toCompositeQuestion(index){
      let height = document.getElementById('compositeQuestion'+index).offsetTop;
      if (this.isInTheChapter) {
        this.$parent.toToSetScrollTop(height - 50);
      } else if (this.isInTheTest) {
        document.documentElement.scrollTop = height - 50;
      } else{
        document.documentElement.scrollTop = height + 70;
      }
    },
    /** 题目解析的显示隐藏 */
    showAnalysisCon: function (event, index, preIndex,index0) {
      if (0 === preIndex) {
        if (this.answer.judgeAnswer[index].showAnalysis) {
          this.answer.judgeAnswer[index].showAnalysis = false
        } else {
          this.answer.judgeAnswer[index].showAnalysis = true
        }
      }else if (1 === preIndex){
        if (this.answer.choiceAnswer[index].showAnalysis) {
          this.answer.choiceAnswer[index].showAnalysis = false
        } else {
          this.answer.choiceAnswer[index].showAnalysis = true
        }
      }else if(2 === preIndex){
        if (this.answer.gapFillingAnswer[index].showAnalysis) {
          this.answer.gapFillingAnswer[index].showAnalysis = false
        } else {
          this.answer.gapFillingAnswer[index].showAnalysis = true
        }
      }else if(3 === preIndex){
        if (this.answer.shortAnswerAnswer[index].showAnalysis) {
          this.answer.shortAnswerAnswer[index].showAnalysis = false
        } else {
          this.answer.shortAnswerAnswer[index].showAnalysis = true
        }
      }else if(4 === preIndex){
        if (this.answer.compositeAnswer[index].answer[index0].showAnalysis) {
          this.answer.compositeAnswer[index].answer[index0].showAnalysis = false
        } else {
          this.answer.compositeAnswer[index].answer[index0].showAnalysis = true
        }
      }
      this.$forceUpdate();
    },
    /** 获取题目数组 */ 
    getPaperslist: function () {
      if(this.papersType === '0'){
      }else{
        this.answer.judgeAnswer = [];
        this.answer.choiceAnswer = [];
        this.answer.gapFillingAnswer = [];
        this.answer.shortAnswerAnswer = [];
        this.answer.compositeAnswer = [];
        for (let index = 0; index < this.judgeQuestions.length; index++) {
          let obj = {};
          if (this.historyAnswers && this.historyAnswers.length > 0) {
            for (let i = 0; i < this.historyAnswers.length; i++) {
              if (this.historyAnswers[i].questionsId === this.judgeQuestions[index].questionsId) {
                obj = {
                  optionId: this.judgeQuestions[index].questionsId,
                  replyIds: this.historyAnswers[i].replyId ? ((this.historyAnswers[i].replyId).split(","))[0] : '',
                  content: ''
                }
              }
            }
          }else{
              obj = {
                optionId: this.judgeQuestions[index].questionsId,
                replyIds: '',
                content: ''
              }
          }
          this.answer.judgeAnswer.push(obj);
        }

        for (let index = 0; index < this.choiceQuestions.length; index++) {
          let obj = {};
          if(this.choiceQuestions[index].questionsType === '1'){
            if (this.historyAnswers && this.historyAnswers.length > 0) {
              for (let i = 0; i < this.historyAnswers.length; i++) {
                if (this.historyAnswers[i].questionsId === this.choiceQuestions[index].questionsId) {
                  obj = {
                    optionId: this.choiceQuestions[index].questionsId,
                    replyIds: this.historyAnswers[i].replyId ? ((this.historyAnswers[i].replyId).split(","))[0] : '',
                    content: ''
                  }
                }
              }
            }else{
                obj = {
                  optionId: this.choiceQuestions[index].questionsId,
                  replyIds: '',
                  content: ''
                }
            }
          }else{
            if (this.historyAnswers && this.historyAnswers.length > 0) {
              for (let i = 0; i < this.historyAnswers.length; i++) {
                if (this.historyAnswers[i].questionsId === this.choiceQuestions[index].questionsId) {
                  let replyIds = [];
                  if (this.historyAnswers[i].replyId) {
                    let arrTemp = this.historyAnswers[i].replyId.split(",");
                    arrTemp.forEach(element => {
                      if (element && element !== '') {
                        replyIds.push(element);
                      }
                    });
                  }
                  obj = {
                    optionId: this.choiceQuestions[index].questionsId,
                    replyIds: replyIds,
                    content: ''
                  }
                }
              }
            }else{
                obj = {
                  optionId: this.choiceQuestions[index].questionsId,
                  replyIds: [],
                  content: ''
                }
            }
          }
          this.answer.choiceAnswer.push(obj);
        }

        for (let index = 0; index < this.shortAnswerQuestions.length; index++) {
          let obj = {};
          if (this.historyAnswers && this.historyAnswers.length > 0) {
            for (let i = 0; i < this.historyAnswers.length; i++) {
              if (this.historyAnswers[i].questionsId === this.shortAnswerQuestions[index].questionsId) {
                obj = {
                  optionId: this.shortAnswerQuestions[index].questionsId,
                  replyIds: '',
                  content: this.historyAnswers[i].content ? this.historyAnswers[i].content : ''
                }
              }
            }
          }else{
              obj = {
                optionId: this.shortAnswerQuestions[index].questionsId,
                replyIds: '',
                content:''
              }
          }
          this.answer.shortAnswerAnswer.push(obj);
        }

        for (let index = 0; index < this.gapFillingQuestions.length; index++) {
          let obj = {};
          if (this.historyAnswers && this.historyAnswers.length > 0) {
            for (let i = 0; i < this.historyAnswers.length; i++) {
              if (this.historyAnswers[i].questionsId === this.gapFillingQuestions[index].questionsId) {
                obj = {
                  optionId: this.gapFillingQuestions[index].questionsId,
                  gapFillingList: this.historyAnswers[i].gapFillingList,
                  content: ''
                }
              }
            }
          }else{
              let replyIds = [];
              if (this.gapFillingQuestions[index].optionList) {
                for (let index0 = 0; index0 < this.gapFillingQuestions[index].optionList.length; index0++) {
                  replyIds.push({id:'',content:''});
                }
              }else{
                for (let index0 = 0; index0 < this.gapFillingQuestions[index].gapFillingNumber; index0++) {
                  replyIds.push({id:'',content:''});
                }
              }
              
              obj = {
                optionId: this.gapFillingQuestions[index].questionsId,
                questionsScore: this.gapFillingQuestions[index].questionsScore,
                gapFillingList: replyIds,
                content:''
              }
          }
          this.answer.gapFillingAnswer.push(obj);
        }
        
        this.compositeQuestions.forEach((item, index) => {
          let arrTemp = [];
          if (!item.questionList) {
            return;
          }
          item.questionList.forEach((item0,index0) => {
            let obj = {};
            if (item0.questionsType === '1') {
              if (this.historyAnswers && this.historyAnswers.length > 0) {
                for (let i = 0; i < this.historyAnswers.length; i++) {
                  if (this.historyAnswers[i].questionsId === item0.questionsId) {
                    obj = {
                      optionId: item0.questionsId,
                      replyIds: this.historyAnswers[i].replyId ? ((this.historyAnswers[i].replyId).split(","))[0] : '',
                      content: ''
                    }
                  }
                }
              }else{
                  obj = {
                    optionId: item0.questionsId ? item0.questionsId : '123',
                    replyIds: '',
                    content: ''
                  }
              }
              
            }
            if (item0.questionsType === '2') {
              if (this.historyAnswers && this.historyAnswers.length > 0) {
                for (let i = 0; i < this.historyAnswers.length; i++) {
                  if (this.historyAnswers[i].questionsId === item0.questionsId) {
                    let replyIds = [];
                    if (this.historyAnswers[i].replyId) {
                      let arrTemp = this.historyAnswers[i].replyId.split(",");
                      arrTemp.forEach(element => {
                        if (element && element !== '') {
                          replyIds.push(element);
                        }
                      });
                    }
                    obj = {
                      optionId: item0.questionsId,
                      replyIds: replyIds,
                      content: ''
                    }
                  }
                }
              }else{
                obj = {
                  optionId: item0.questionsId ? item0.questionsId : '123',
                  replyIds: [],
                  content: ''
                }
              }
              
            }
            if (item0.questionsType === '3') {
              if (this.historyAnswers && this.historyAnswers.length > 0) {
                for (let i = 0; i < this.historyAnswers.length; i++) {
                  if (this.historyAnswers[i].questionsId === item0.questionsId) {
                    obj = {
                      optionId: item0.questionsId,
                      replyIds: this.historyAnswers[i].replyId ? ((this.historyAnswers[i].replyId).split(","))[0] : '',
                      content: ''
                    }
                  }
                }
              }else{
                  obj = {
                    optionId: item0.questionsId ? item0.questionsId : '123',
                    replyIds: '',
                    content: ''
                  }
              }
              
            }
            if (item0.questionsType === '4') {
              if (this.historyAnswers && this.historyAnswers.length > 0) {
                for (let i = 0; i < this.historyAnswers.length; i++) {
                  if (this.historyAnswers[i].questionsId === item0.questionsId) {
                    obj = {
                      optionId: item0.questionsId,
                      replyIds: '',
                      content: this.historyAnswers[i].content ? this.historyAnswers[i].content : ''
                    }
                  }
                }
              }else{
                  obj = {
                    optionId: item0.questionsId ? item0.questionsId : '123',
                    replyIds: '',
                    content:''
                  }
              }
              
            }
            if (item0.questionsType === '5') {
              if (this.historyAnswers && this.historyAnswers.length > 0) {
                for (let i = 0; i < this.historyAnswers.length; i++) {
                  if (this.historyAnswers[i].questionsId === item0.questionsId) {
                    obj = {
                      optionId: item0.questionsId,
                      gapFillingList: this.historyAnswers[i].gapFillingList,
                      content: ''
                    }
                  }
                }
              }else{
                let replyIds = [];
                if (item0.optionList) {
                  for (let index0 = 0; index0 < item0.optionList.length; index0++) {
                    replyIds.push({id:'',content:''});
                  }
                }else{
                  for (let index0 = 0; index0 < item0.gapFillingNumber; index0++) {
                    replyIds.push({id:'',content:''});
                  }
                }
                obj = {
                  optionId: item0.questionsId ? item0.questionsId : '123',
                  questionsScore: item0.questionsScore,
                  gapFillingList: replyIds,
                  content:''
                }
              }
            }
            arrTemp.push(obj);
          })
          let tempObj = {answer: arrTemp};
          this.answer.compositeAnswer.push(tempObj);
        })

      }
      this.paperslist = [
        {name: '判断题', num: this.judgeQuestions.length, children: this.judgeQuestions},
        {name: '选择题', num: this.choiceQuestions.length, children: this.choiceQuestions},
        {name: '填空题', num: this.gapFillingQuestions.length, children: this.gapFillingQuestions},
        {name: '简答题', num: this.shortAnswerQuestions.length, children: this.shortAnswerQuestions},
        {name: '复合题', num: this.compositeQuestions.length, children: this.compositeQuestions},
      ]
      this.handleOption();
      // let params = {}
      // params.majorId = ''
      // params.subjectId = '' // 所属教材
      // params.chaptersId = '' // 所属章节
      // params.questionsType = '' // 题目类型
      // params.questionsComplexity = '' // 题目难易
      // params.sortBy = 'create_time' // 排序条件
      // params.pageNum = 1
      // params.pageSize = 10
      // this.$api.questionbank.query(params).then(res => {
      //   if (res.code === 0) {
      //     if (res.data && res.data.list && res.data.list.length > 0) {
      //       res.data.list.forEach(item => {
      //         item.showAnalysis = false
      //         // 正确答案
      //         if (item.replyIds && item.replyIds.split(',') && item.replyIds.split(',').length > 0 && item.optionList && item.optionList.length > 0) {
      //           let repList = item.replyIds.split(',')
      //           let optionList = item.optionList
      //           for (let a = 0; a < optionList.length; a++) {
      //             optionList[a].isRight = false
      //             for (let i = 0; i < repList.length; i++) {
      //               if (repList[i] && optionList[a].optionId && repList[i] === optionList[a].optionId) {
      //                 optionList[a].isRight = true
      //                 break
      //               }
      //             }
      //           }
      //         }
      //       })
      //       this.paperslist[0].children = res.data.list
      //       this.paperslist[1].children = res.data.list
      //     }
      //   }
      // })
    },
    handleCommand: function (command, topic, index) {
      // console.log('command', command)
      if (command && command === 'reelect') {
        this.reelectTopic(topic);
      } else if (command && command === 'edit'){
        this.editQuestion(topic, index);
      } else if (command && command === 'del') {
        this.delTopic(topic);
      }
    },
    //重选题目
    reelectTopic(topic){
      let tempArr = [];
      //获取所有题目id
      for (let index = 0; index < this.judgeQuestions.length; index++) {
        tempArr.push(this.judgeQuestions[index].questionsId);
      }
      for (let index = 0; index < this.choiceQuestions.length; index++) {
        tempArr.push(this.choiceQuestions[index].questionsId);
      }
      for (let index = 0; index < this.gapFillingQuestions.length; index++) {
        tempArr.push(this.gapFillingQuestions[index].questionsId);
      }
      for (let index = 0; index < this.shortAnswerQuestions.length; index++) {
        tempArr.push(this.shortAnswerQuestions[index].questionsId);
      }
      for (let index = 0; index < this.compositeQuestions.length; index++) {
        tempArr.push(this.compositeQuestions[index].questionsId);
      }
      let tempString = tempArr.join(",");
      let formData = null; // new FormData();
      // formData.append('oldQuestionsId', tempString);

      let urlName = 'activityTest'
      
      if (this.isOrganizingPreviewPaper) {
        urlName = 'questionbank';
        formData = {
          oldQuestionsId: tempString,
          newQuestionsId: topic.questionsId,
          subjectNum:'0',
          chapterNum :'0'
        };
        if (localStorage.getItem('organizingPapersReSelectDatas') && localStorage.getItem('organizingPapersReSelectDatas') !== undefined) {
          let organizingPapersReSelectDatas  = JSON.parse(localStorage.getItem('organizingPapersReSelectDatas'));
          formData.subjectNum = organizingPapersReSelectDatas.subjectNum.toString();
          formData.chapterNum = organizingPapersReSelectDatas.chapterNum.toString();
        }

        // formData.append('newQuestionsId', topic.questionsId);
      } else {
        formData = new FormData();
        formData.append('oldQuestionsId', tempString);
        formData.append('questionsId', topic.questionsId);
      }
      this.$api[urlName].randomQuestions(formData).then(res => {
        if (res.code === 0) {
          // 正确答案
          res.data = this.handleReplyId(res.data)
          if (res.data && res.data.children && res.data.children.length > 0) {
            res.data.children.forEach(itemc => {
              itemc = this.handleReplyId(itemc)
            })
          }
          

          if ('6' === res.data.questionsType) {
            res.data.questionList = res.data.children;
          }
          //替换题目
          for (let index = 0; index < this.paperslist.length; index++) {
            for (let i = 0; i < this.paperslist[index].children.length; i++) {
              if (topic.questionsId === this.paperslist[index].children[i].questionsId) {
                this.paperslist[index].children.splice(i,1,res.data);
              }
            }
          }
        }else{
          toast(res.msg);
        }
      })
    },
    // 处理正确答案 公共方法
    handleReplyId: function(item) {
      // 正确答案
      if (item && item.replyIds && item.replyIds.split(',') && item.replyIds.split(',').length > 0 && item.optionList && item.optionList.length > 0) {
        const repList = item.replyIds.split(',')
        const optionList = item.optionList
        for (let a = 0; a < optionList.length; a++) {
          optionList[a].isRight = false
          for (let i = 0; i < repList.length; i++) {
            if (repList[i] && optionList[a].optionId && repList[i] === optionList[a].optionId) {
              optionList[a].isRight = true
              break
            }
          }
        }
      }
      return item
    },
    //删除题目
    delTopic(topic){
      for (let index = 0; index < this.paperslist.length; index++) {
        for (let i = 0; i < this.paperslist[index].children.length; i++) {
          if (topic.questionsName === this.paperslist[index].children[i].questionsName) {
            this.paperslist[index].children.splice(i,1);
          }
        }
      }
      // let formData = new FormData();
      // formData.append('questionsId', topic.questionsId);
      // formData.append('questionsType', topic.questionsType);
      // this.$api.activityTest.deleteQuestions(formData).then(res => {
      //   if (res.code === 0) {
      //     for (let index = 0; index < this.paperslist.length; index++) {
      //       for (let i = 0; i < this.paperslist[index].children.length; i++) {
      //         if (topic.questionsId === this.paperslist[index].children[i].questionsId) {
      //           this.paperslist[index].children.splice(i,1);
      //         }
      //       }
      //     }
      //   }else{
      //     topic(res.msg);
      //   }
      // })
    },
    //获取所有选题的id
    getAllTopicId(){
      let arr = [];
      for (let index = 0; index < this.paperslist.length; index++) {
        for (let i = 0; i < this.paperslist[index].children.length; i++) {
          arr.push(this.paperslist[index].children[i]);
        }
      }
      return arr;
    },
    //获取当前选择题长度
    getChoiceQuestionsLength(){
      return this.choiceQuestions.length;
    },
    //获取当前判断题长度
    getJudgeQuestionsLength(){
      return this.judgeQuestions.length;
    },
    //获取当前简答题长度
    getShortAnswerQuestionsLength(){
      return this.shortAnswerQuestions.length;
    },
    //打分
    handleAnswerScore(value){
      if (value.userScore) {
        let formData = new FormData();
        formData.append('ctId',this.textInfo.ctId);
        formData.append('pkgId',this.textInfo.pkgId);
        formData.append('activityId',this.textInfo.activityId);
        formData.append('questionsScore',value.userScore);
        formData.append('scoreId',value.scoreId);
        this.$api.activityTest.giveScore(formData).then(res => {
          toast(res.msg);
          this.$parent.getTopicInfo();
        })
      }else{
        toast("请输入分值");
      }
      
    },
  }
}
</script>

<style scoped>
.question-pagers-wrapper{
  background-color: #fff;
  width: 100%;
  padding-bottom: 20px;
}
.papers-name{
  font-weight: 700;
  padding: 10px;
  font-size: 20px;
}
.papers-time-nums-wrapper{
  display: flex;
  align-content: center;
  justify-content: center;
  font-size: 14px;
}
.papers-time{
  margin-right: 50px;
}
.pages-list-wrapper{
  margin: 10px;
}
.papers-type{
  display: flex;
  justify-content: space-between;
}
.papers-type-name{
  text-align: left;
  padding: 2px 10px;
  border-left: 2px solid #333;
  margin-bottom: 10px;
  font-weight: bold;
}
.papers-select-wrapper{
  margin: 10px 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-bottom: 10px;
}
.short-answer-write{
  margin: 10px 0 20px 0;
  padding-bottom: 20px;
}
.short-answer-score{
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
.papers-select-wrapper label{
  margin-bottom: 0;
}
.papers-select-label{
  font-size: 15px;
  font-weight: bold;
  margin-right: 20px;
}

.quesList > .list-item{
        position: relative;
        list-style:none;
        background-color: #FFF;
        padding: 15px 15px 0 15px;
        margin-bottom: 12px;
        text-align: left;
    }
    .quesList > .list-item:hover{
      box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 5px 0px;
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
  /* 选择题目区域样式 */
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
  /* 单选多选显示样式 */
  .question-type{
    border-radius: 2px;
    height: 20px;
    min-width: 60px;
    padding: 0 7px;
    margin: 0 5px;
    font-size: 14px;
    background: #ffe2d9;
    border: 1px solid #ffb399;
  }
  /* 答题正确样式 */
  .correct-test-question .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #67c23a;
    border-color: #67c23a;
  }
  .correct-test-question .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #67c23a;
  }
  .correct-test-question .el-radio__input.is-checked .el-radio__inner{
    background:#67c23a;
    border-color: #67c23a;
  }
  .correct-test-question .el-radio__input.is-checked+.el-radio__label {
    color: #67c23a;
  }
  /* 答题错误样式 */
  .error-test-question .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: red;
    border-color: red;
  }
  .error-test-question .el-checkbox__input.is-checked+.el-checkbox__label {
    color: red;
  }
  .error-test-question .el-radio__input.is-checked .el-radio__inner{
    background:red;
    border-color: red;
  }
  .error-test-question .el-radio__input.is-checked+.el-radio__label {
    color: red;
  }
  /* 填空题作答样式 */
  .gap-filling-answer{
    display: flex;
    margin: 15px 0;
  }
  .gap-filling-wrapper{
    padding: 20px 0;
  }
  .gap-filling-title{
    width: 100px;
    line-height: 38px;
  }
  /* 题目下拉操作样式 */
  .list-item-dropdown{
    position: absolute;
    /* top: 0; */
    top: 20px;
    right:15px;
    width:50px;
    /* height:50px; */
    text-align: center;
    z-index: 555;
  }
  .list-item-dropdown /deep/ .el-dropdown-link i{
    font-size: 15px;
  }
  .list-item-dropdown /deep/ .el-dropdown-link:hover > i{
    transform: rotate(180deg);
  }
  .list-item-dropdown-menu /deep/ .el-dropdown-menu__item{
    padding: 0 35px;
  }
  .list-questions-name{
    margin: 0 0 10px;
    overflow-wrap: break-word;
    width: 90%;
    word-break: break-all;
    padding-right: 10px;
    box-sizing: border-box;
  }
  .list-questions-name-organizing{
    width: 86%;
  }
  /* /deep/ .saveTestDialogClass{
      height: 75vh;
      overflow: auto;
    } */
    /deep/ .saveTestDialogClass .el-dialog__body{
      height: 63vh;
      overflow: auto;
    }
    .gap-filling-correct-Form{
      padding-right: 10px;
      box-sizing: border-box;
    }
</style>
