<template>
    <div class="surname-panel">
        <Button :class="{'sur-chsed': surname !== ''}" :type="surname === '' ? 'warning' : 'ghost'" @click="showModal">{{surname || '选择姓氏'}}</Button>
        <Modal
            v-model="modal"
            title="选择姓氏">
            <Form ref="formInline" inline>
                <Form-item prop="searchSurname">
                    <Input type="text" v-model="searchSurname" placeholder="搜索姓氏"></Input>
                </Form-item>
                <Form-item>
                    <Button type="primary" @click="querySurname(1)">搜索</Button>
                </Form-item>
            </Form>
            <Radio-group v-model="surname" @on-change="choose">
                <Radio v-for="item in surnameList" :key="item.surnameId" :label="item.surname" style="margin-right: 50px"></Radio>
            </Radio-group>
        </Modal>
    </div>
</template>

<script>
export default {
  created () {
    this.querySurname()
  },
  data () {
    return {
      modal: false,
      searchSurname: '',
      currPage: 1,
      pageNum: 1,
      surname: '',
      orgName: '',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '姓氏',
          key: 'surname'
        }
      ],
      surnameList: []
    }
  },
  computed: {
    http () {
      return this.$store.state.http
    }
  },
  methods: {
    querySurname (currPage) {
      const url = '/edit-clan-pedigree/agent-surname'
      const param = {
        surname: this.searchSurname,
        currPage: currPage || 1
      }
      this.http('agent', url, 'get', param, res => {
//      console.log('查询姓氏返回:')
//      console.log(res)
        let result = res.data.data
        this.surnameList = result
        // 从查询结果中取出组织名称，并选择一个默认姓氏
        if (result.length > 0) {
          let firstItem = result[0]
          if (firstItem.orgName) this.$store.commit('getOrg', { orgName: firstItem.orgName })
          if (this.surname === '') this.choose(firstItem.surname)
        }
        this.pageNum = res.data.pageNum
      })
    },
    showModal () {
      if (this.surnameList.length > 1) this.modal = true
    },
    choose (param) {
      for (let item of this.surnameList) {
        if (item.surname === param) {
          this.surname = param
          this.$store.commit('changeSurname', item)
          break
        }
      }
    }
  }
}
</script>
<style scoped>
.surname-panel {
    display: inline-block;
    padding: 16px 0;
}
.sur-chsed {
    background: #fff;
    color: #57aafe;
    font-size: 20px;
    padding: 4px 10px;
}
.sur-chsed:hover {
    background: #eee;
    color: #57aafe;
}
</style>
