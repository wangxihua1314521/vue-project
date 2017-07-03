<template>
	<div id="content">
		<Tabs type="card">
			<!--申请人列表-->
	        <Tab-pane label="app族谱管理员审核列表">
	        	<Row>
				    <Col span="3" >
				    	<span class="searchText">快速搜索:</span>
				    	<Surname></Surname>
					     <Select v-model="searchParam1.appealType" clearable style="width:80px" @change="queryApply(1)">
					        <Option value="1">姓名</Option>
					        <Option value="2">手机号</Option>
					    </Select>
				    </Col>
				    <Col span="21">
				    	<Input v-model="searchParam1.personName" placeholder="请输入姓名" style="width: 300px;padding: 16px 10px;"></Input>
				    	<Input v-model="searchParam1.tel" placeholder="请输入手机号" style="width: 300px;padding: 16px 10px;"></Input>
				    	<Button type="primary" icon="ios-search" @click="queryApply(1)" style="margin-right: 10px;">搜索</Button>
		                <Button type="primary" @click="addApply(1)">添加</Button>
				    </Col>
				</Row>
	        	<div id="manList">
					<el-table ref="multipleTable" :data="data1" border tooltip-effect="dark" class="m-bottom-md" style="width: 100%;margin-bottom: 10px;">
		                <el-table-column align="center" label="选择" type="selection" width="55"></el-table-column>
		                <el-table-column align="center" type="index" label="序号" width="100"></el-table-column>
		                <el-table-column align="center" prop="personName" label="姓名" width="100"></el-table-column>
		                <el-table-column align="center" prop="gender" label="性别" width="100"></el-table-column>
		                <el-table-column align="center" prop="tel" label="手机号" width="200"></el-table-column>
		                <el-table-column align="center" prop="address" label="地区" min-width="300"></el-table-column>
		                <el-table-column align="center" prop="applyTime" label="申请时间" width="300"></el-table-column>
		                <el-table-column align="center" label="操作" width="250">
		                    <template scope="scope">
			                    <Button type="primary" @click="showApplyDetail(scope.$index, scope.row)">查看</Button>
			                    <Button type="primary" @click="auditApplyDetail(scope.$index, scope.row)">审核</Button>
			                </template>
		                </el-table-column>
		            </el-table>
		            <Page :total="pageNum1" :current="currPage1" @on-change="queryApply" show-elevator></Page>
				</div>
				<!--审核申请人-->
				<Modal
			        v-model="modal1"
			        title="审核信息"
			        ok-text="申请通过"
        			cancel-text="申请不通过"
        			width="650"
			        @on-ok="ok()"
			        @on-cancel="cancel"
			        :closable="false">
			        <div id="">
			        	<h3>申请族谱信息</h3>
						<Row style="margin:5px 0;padding-left: 50px;">
					        <Col span="4">申请管理族谱:</Col>
					        <Col span="10">福建省武平县刘氏云族谱</Col>
					    </Row>
				        <Row style="margin:5px 0;padding-left: 50px;">
					        <Col span="4">云族谱管理员:</Col>
					        <Col span="4">10人</Col>
					    </Row>
				        <Row style="margin:5px 0;padding-left: 50px;">
					        <Col span="4">宗亲会:</Col>
					        <Col span="4">无</Col>
					    </Row>
					    <Row style="margin:5px 0;padding-left: 50px;">
					        <Col span="4">代理商:</Col>
					        <Col span="4">无</Col>
					    </Row>
			        </div>
			        <div id="">
			        	<h3>申请人信息</h3>
						<Row style="margin:5px 0;padding-left: 50px;">
					        <Col span="4">申请人姓名:</Col>
					        <Col span="10">刘大大</Col>
					    </Row>
				        <Row style="margin:5px 0;padding-left: 50px;">
					        <Col span="4">联系电话:</Col>
					        <Col span="4">13522222222</Col>
					    </Row>
					    <div class="volun-info-img">
				            <img src="../../assets/images/detail.jpg" alt="身份证件">
				            <img src="../../assets/images/detail.jpg" alt="身份证件">
				        </div>
			        </div>
			   </Modal>
			   <!--查看申请人详情-->
				<Modal
			        v-model="modal"
			        title="管理员信息"
        			width="650">
			        <div id="">
			        	<h3>族谱信息</h3>
						<Row style="margin:5px 0;padding-left: 50px;">
					        <Col span="4">申请管理族谱:</Col>
					        <Col span="10">福建省武平县刘氏云族谱</Col>
					    </Row>
				        <Row style="margin:5px 0;padding-left: 50px;">
					        <Col span="4">云族谱管理员:</Col>
					        <Col span="4">10人</Col>
					    </Row>
				        <Row style="margin:5px 0;padding-left: 50px;">
					        <Col span="4">宗亲会:</Col>
					        <Col span="4">无</Col>
					    </Row>
					    <Row style="margin:5px 0;padding-left: 50px;">
					        <Col span="4">代理商:</Col>
					        <Col span="4">无</Col>
					    </Row>
			        </div>
			        <div id="">
			        	<h3>人员信息</h3>
						<Row style="margin:5px 0;padding-left: 50px;">
					        <Col span="4">申请人姓名:</Col>
					        <Col span="10">刘大大</Col>
					    </Row>
				        <Row style="margin:5px 0;padding-left: 50px;">
					        <Col span="4">联系电话:</Col>
					        <Col span="4">13522222222</Col>
					    </Row>
					    <div class="volun-info-img">
				            <img src="../../assets/images/detail.jpg" alt="身份证件">
				            <img src="../../assets/images/detail.jpg" alt="身份证件">
				        </div>
			        </div>
			   </Modal>
	        </Tab-pane>
	        <!--管理员列表-->
	        <Tab-pane label="app管理员列表">
	        	<Row>
				    <Col span="3">
				    	<span class="searchText">快速搜索:</span>
				    	<Surname></Surname>
					    <Select v-model="searchParam2.appealType" clearable style="width:80px" @change="queryAdmin(1)">
					        <Option value="1">姓名</Option>
					        <Option value="2">手机号</Option>
					    </Select>
				    </Col>
				    <Col span="21">
				    	<Input v-model="searchParam2.personName" placeholder="请输入姓名" style="width: 300px;padding: 16px 10px;"></Input>
				    	<Input v-model="searchParam2.tel" placeholder="请输入手机号" style="width: 300px;padding: 16px 10px;"></Input>
				    	<Button type="primary" icon="ios-search" @click="queryAdmin(1)" style="margin-right: 10px;">搜索</Button>
				    </Col>
				</Row>
				<Button type="primary" style="margin: 0 0 16px 10px;" @click="removeAdmin">移除管理员</Button>
	        	<div id="manList">
					<el-table ref="multipleTable" :data="data2" border tooltip-effect="dark" class="m-bottom-md" style="width: 100%" @selection-change="selectList">
		                <el-table-column align="center" label="选择" type="selection" width="55"></el-table-column>
		                <el-table-column align="center" type="index" label="序号" width="100"></el-table-column>
		                <el-table-column align="center" prop="personName" label="姓名" width="100"></el-table-column>
		                <el-table-column align="center" prop="gender" label="性别" width="100"></el-table-column>
		                <el-table-column align="center" prop="tel" label="手机号" width="200"></el-table-column>
		                <el-table-column align="center" prop="address" label="地区" min-width="300"></el-table-column>
		                <el-table-column align="center" prop="man" label="审核人" width="200"></el-table-column>
		                <el-table-column align="center" prop="applyTime" label="申请时间" width="300"></el-table-column>
		                <el-table-column align="center" label="操作" width="200">
	                    	<template scope="scope">
			                    <Button type="primary" @click="showAdminDetail(scope.$index, scope.row)">查看</Button>
			                </template>
		                </el-table-column>
		            </el-table>
				</div>
				<Page :total="pageNum2" :current="currPage2" show-elevator></Page>
				<!--管理员详情-->
				<Modal
			        v-model="modal2"
			        title="管理员信息"
        			width="650">
			        <div id="">
			        	<h3>族谱信息</h3>
						<Row style="margin:5px 0;padding-left: 50px;">
					        <Col span="4">申请管理族谱:</Col>
					        <Col span="10">福建省武平县刘氏云族谱</Col>
					    </Row>
				        <Row style="margin:5px 0;padding-left: 50px;">
					        <Col span="4">云族谱管理员:</Col>
					        <Col span="4">10人</Col>
					    </Row>
				        <Row style="margin:5px 0;padding-left: 50px;">
					        <Col span="4">宗亲会:</Col>
					        <Col span="4">无</Col>
					    </Row>
					    <Row style="margin:5px 0;padding-left: 50px;">
					        <Col span="4">代理商:</Col>
					        <Col span="4">无</Col>
					    </Row>
			        </div>
			        <div id="">
			        	<h3>人员信息</h3>
						<Row style="margin:5px 0;padding-left: 50px;">
					        <Col span="4">申请人姓名:</Col>
					        <Col span="10">刘大大</Col>
					    </Row>
				        <Row style="margin:5px 0;padding-left: 50px;">
					        <Col span="4">联系电话:</Col>
					        <Col span="4">13522222222</Col>
					    </Row>
					    <div class="volun-info-img">
				            <img src="../../assets/images/detail.jpg" alt="身份证件">
				            <img src="../../assets/images/detail.jpg" alt="身份证件">
				        </div>
			        </div>
			   </Modal>
			   <!--删除对话框-->
		        <Modal v-model="deleteModal" width="360">
		            <p slot="header" style="color:#f60;text-align:center">
		                <Icon type="information-circled"></Icon>
		                <span>删除确认</span>
		            </p>
		            <div style="text-align:center">
		                <p>是否删除选中的管理员？</p>
		            </div>
		            <div slot="footer">
		                <Button type="warning" size="large" long @click="deteItem">删除</Button>
		            </div>
		        </Modal>
	        </Tab-pane>
	    </Tabs>
	</div>
</template>
<script>
import surnameComp from '@/components/surname'
export default {
  data () {
    return {
    	modal: false,
    	modal1: false,
    	modal2: false,
    	deleteModal:false,
    	value: '',
    	currPage1: 1,
    	currPage2: 1,
    	model1: '',
    	model2: '',
        pageNum1: 1,
        pageNum2: 1,
        //姓名搜索
        searchParam1: {
        	personName: '',
        	appealType: '1',
			tel: ''
        },
        //手机号搜索
        searchParam2: {
        	personName: '',
        	appealType: '1',
			tel: ''
        },
        selectIdList: [],
        data1: [],
        data2: [],
        ids: ''
    } 
  },
  computed: {
  	http(){
  		return this.$store.state.http
  	}
  },
  activated () {
    this.queryApply(1)
    this.queryAdmin(1)
  },
  components: {
    Surname: surnameComp
  },
  methods: {
  	//查询申请管理员列表
  	queryApply (currPage1){
        const url = '/clan-tree-admins'
        let searchParam = this.searchParam1
        let param = {
        	currPage: currPage1 || 1,
        	personName: searchParam.personName,
            tel: searchParam.tel,
            type: 'apply'
        }
        this.http('agent', url, 'get', param, res => {
        	console.log('审核列表')
            console.log(res) 
        	let result = res.data
        	let applyList = result.data
            for(let item of applyList){
            	item.checked = false
            	item.gender = (item.gender === '1' ? '男' : '女')
            }
            this.data1 = applyList
            this.pageNum1 = result.totalPage
        })
  	},
  	//查询管理员列表
  	queryAdmin (currPage2){
        const url = '/clan-tree-admins'
        let searchParam = this.searchParam2
        console.log(searchParam.tel)
        let param = {
        	currPage: currPage2 || 1,
        	personName: searchParam.personName,
            tel: searchParam.tel,
            type: 'admin'
        }
        this.http('agent', url, 'get', param, res => {
        	console.log('管理员列表')
            console.log(res) 
            let result = res.data
        	let adminList = result.data
            for(let item of adminList){
            	item.checked = false
            	item.gender = (item.gender === '1' ? '男' : '女')
            }
            this.data2 = adminList
            this.pageNum2 = result.totalPage
        })
  	},
  	//添加管理员
  	addApply (currPage1){
  		const url = '/clan-tree-admins/apply'
  		let param = {
  			currPage: currPage1 || 1,
        	personName: '一二',
            tel: '13222222',
			orgId: '111111',
			clanTreeCode: '15655'
  		}
		this.http('agent',url,'post',param,res => {
			console.log(res)
			this.queryApply(1)
		})
  	},
  	//申请人详情
	showApplyDetail (index, row) {
        let item = this.data1[index]
        let userId = item.userId
        this.modal = true
//      let param = {
//      	type: 'apply',
//      }
//      const url = '/clan-tree-admins/'+ userId
//      this.http('agent', url, 'get', param, res => {
//          console.log('详情')
//          console.log(res)
//      })
    },
    //审核
    auditApplyDetail (index, row){
	   	let item = this.data1[index]
	   	let userId = item.userId
	   	sessionStorage.setItem('applyId',userId)
	   	this.modal1 = true	
    },
   //管理员详情
    showAdminDetail (index, row){
	   	let item = this.data2[index]
	   	let userId = item.userId
	   	sessionStorage.setItem('adminId',userId)
	   	this.modal2 = true	
    },
//  applyList (list) {
//      this.selectIdList = list
//  },
    selectList (list) {
        this.selectIdList = list
    },
   //审核通过
  	ok () {
        this.$Message.info("审核通过")
        var userId = sessionStorage.getItem('applyId');
        const url = '/clan-tree-admins/'+ userId + '/approve'
        let param = {}
        this.http('agent',url,'put',param,res => {
        	console.log(res)
            this.queryApply(1)
        	this.queryAdmin(1)
        })
    },
    //审核不通过
    cancel () {
        this.$Message.info("审核不通过")
        var userId = sessionStorage.getItem('applyId');
        console.log(userId)
        const url = '/clan-tree-admins/'+ userId + '/reject'
        let param = {}
        this.http('agent',url,'put',param,res => {
        	console.log(res)
        	this.queryApply(1)
        })
    },
    //移除管理员
    removeAdmin (){
    	let ids = '';
    	console.log('移除管理员')
    	let list = this.selectIdList
    	for(let item of list){
    		ids += item.userId + ','
    	}
        console.log('选中的项' + ids)
        ids = ids.substring(0, ids.length - 1)
        if(ids === ""){
        	this.$Message.error('请选择要删除的项')
            return
        }else{
    		this.ids = ids
    		console.log('移除的项' + ids)
    		this.deleteModal = true
        }
        
    },
    //确认是否删除
    deteItem (){
    	this.deleteModal = false;
    	let userId = this.ids
    	let param = {}
    	const url = '/clan-tree-admins/'+ userId
    	this.http('agent',url,'delete',param,res => {
    		console.log(res)
            this.$Message.success('删除成功')
            this.queryAdmin(1)
    	})
    }
  }
}
</script>

<style scoped>
section{
	color: #000;
}
/*搜索*/
.search{
	box-sizing: border-box;
	border: 1px solid #333;
	margin-top: 10px;
}
#manList{
	margin-bottom: 20px;
}
.search{
	box-sizing: border-box;
	border: 1px solid #333;
	margin-top: 10px;
}
.searchText{
	font-size: 16px;
	display: inline-block;
	margin: 5px 10px;
}
.volun-info-img img{
	max-width: 100%;
	margin-left: 50px;
}
</style>
