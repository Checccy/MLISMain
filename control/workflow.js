
$.getJSON('dict.json',function(data){
	$( "body" ).data( "dict", data.DataItem);	
});
$.getJSON('data.json',function(data){
	
	ReactDOM.render(
	<StepBox data={data.DataItem.Template} {...data.DataItem.CurrentStep}/>,
	document.getElementById('container')
	);
});

//检验步骤
var StepBox=React.createClass({
	getInitialState:function(){
		return({
			StepIndex : this.props.StepIndex
		})
	},
	checkTabTagIndex:function(i){
		return this.state.StepIndex==i?"step-tab-normal active":"step-tab-normal";
	},
	checkTabContentIndex:function(i){
		return this.state.StepIndex==i?"row tab-pane active":"row tab-pane"
	},
	render:function(){
		var tabTags=[],tabContents=[];
		
		this.props.data.Children.forEach(function(item,i){
			tabTags.push(<div className={this.checkTabTagIndex(i)} onClick={()=>{this.setState({StepIndex:i})}} key={item.Id} >{item.Name} {item.Alias}</div>)
			tabContents.push(<StepContent  BacteriaIndex={this.props.BacteriaIndex} DayIndex={this.props.DayIndex} className={this.checkTabContentIndex(i)}  item={item} key={item.Id}/>);

		}.bind(this));
		return(
				<div>
					<div className="horizontal border-bottom">{tabTags}</div>
					<div className="tab-content padding-top-10" >{tabContents}</div>
				</div>
			)
	}
});
//步骤内容
var StepContent=React.createClass({
	getInitialState:function(){
		return({
			BacteriaIndex : this.props.BacteriaIndex
		})
	},
	checkTabTagIndex:function(i){
		return this.state.BacteriaIndex==i?"bacteria-tag active":"bacteria-tag";
	},
	checkTabContentIndex:function(i){
		return this.state.BacteriaIndex==i?"tab-pane active":"tab-pane"
	},
	render:function(){
		var bacteriaTags=[],bacteriaContents=[];
		this.props.item.Children.forEach(function(item,i){
			bacteriaTags.push(<div key={item.Id} className={this.checkTabTagIndex(i)} onClick={()=>{this.setState({BacteriaIndex:i})}}>{item.Name}</div>);
			bacteriaContents.push(<Bacteria DayIndex={this.props.DayIndex} className={this.checkTabContentIndex(i)} item={item} key={item.Id}/>)
		}.bind(this))
		return(
			<div className={this.props.className}>
				<div className="col-xs-1">{bacteriaTags}</div>
				<div className="col-xs-11 tab-content">{bacteriaContents}</div>
			</div>
			)
	}
});
//菌
var Bacteria=React.createClass({
	getInitialState:function(){
		return({DayIndex : this.props.DayIndex==-1?0:this.props.DayIndex})
	},
	checkTabTagIndex:function(i){
		return this.state.DayIndex==i?"day-tag active":"day-tag";
	},
	checkTabContentIndex:function(i){
		return this.state.DayIndex==i?"tab-pane active":"tab-pane"
	},
    render:function () {
        		var days=[],optateBox=[],VirticalItems=[],dayTags=[],dayContents=[],list=[];
	       		this.props.item.Children.forEach(function (item) {
	       			switch(item.ControlType){
	       				case 0:list.push(<OprareBox item={item} key={item.Id}/>);break;
	       				case 1003:days.push(item);break;
	       				default:VirticalItems.push(item);break;
	       			}
		        }.bind(this));
			    if (days.length>0) {
	        		days.forEach(function(item,i){
	        			dayTags.push(<div className={this.checkTabTagIndex(i)} onClick={()=>{this.setState({DayIndex:i})}} key={item.Id}>{item.Name}</div>)
	        			dayContents.push(<DayControl className={this.checkTabContentIndex(i)} item={item} key={item.Id}/>)
	        		}.bind(this))
	        		list=(<div><div className="horizontal border-bottom">{dayTags}</div>
	        			<div className="tab-content">{dayContents}</div></div>)
				}else if(VirticalItems.length>0){
					list=VirticalItems.map(function(item){
						return(<VirticalItem item={item} key={item.Id}  />)
					})
				}
	            return(
	            	<div className={this.props.className}>
	            		{list}
	            	</div>
	            )
        }

});
//天
var DayControl=React.createClass({
	render:function(){
	    var list=this.props.item.Children.map(function (item) {
   			switch(item.ControlType){
   				default:return(<VirticalItem item={item} key={item.Id}  />)
   			}
        }.bind(this));
		return(<div className={this.props.className}>{list}</div>)
	}
})
//列表项
var VirticalItem=React.createClass({
	getInitialState:function(){
		return({
			Children:this.props.item.Children
		})
	},
	handleRadioOnChange:function(index){
		var state={}
		state['Children']=this.state.Children.map(function(item,i){
			if (i==index) {
				if (item.IsChecked) {
					item.IsChecked=false;
				}else{
					item.IsChecked=true;
				}
			}else{
				item.IsChecked=false;
			}
			return item;
		});
		this.setState(state)
	},
	render:function(){
			var childrens=[],groups=[],combobox=[];
			this.state.Children.forEach(function(item,i) {
		     	switch(item.ControlType)
		     	{
		     		case 1500:
		     		if (item.Children.length>0) {
		     			item.Children.forEach(function(groupItem){
							switch(groupItem.ControlType){
								case 1000:
								case 1005:
								childrens.push(<SingleChoice   item={item} parentId={this.props.item.Id} key={item.Id} i={i} handleRadioOnChange={this.handleRadioOnChange}/>);
								groups.push(<VirticalItem isHidden={!item.IsChecked} item={groupItem} key={groupItem.Id}/>);break;
								case 1200:childrens.push(<RadioCommbobox i={i} handleRadioOnChange={this.handleRadioOnChange} parentId={item.Id} item={item} key={item.Id}/>);break;
							}
						}.bind(this));
		     		}else{
		     			childrens.push(<SingleChoice   item={item} parentId={this.props.item.Id} key={item.Id} i={i} handleRadioOnChange={this.handleRadioOnChange}/>);
		     		}
		     		break;
		     		case 1501:childrens.push(<RadioButtonText  item={item} parentId={this.props.item.Id} key={item.Id} i={i} handleRadioOnChange={this.handleRadioOnChange}/>);break;
		     		case 1000:childrens.push(<VirticalItem     item={item} key={item.Id}/>);break;//递归，形如：痰涂片染色镜检
		     		case 1005:childrens.push(<VirticalItem     item={item} key={item.Id}/>);break;//递归，形如：痰涂片染色镜检
		     		case 1100:childrens.push(<NormalTextFeild  item={item} parentId={this.props.item.Id} key={item.Id} />);break;
		     		case 1101:childrens.push(<PetriDishControl item={item} parentId={this.props.item.Id} key={item.Id} />);break;
		     		case 1102:childrens.push(<NormalTextFeild  item={item} parentId={this.props.item.Id} key={item.Id} />);break;
		     		case 1103:childrens.push(<NormalTextFeild  item={item} parentId={this.props.item.Id} key={item.Id} />);break;
		     		case 1203:childrens.push(<InputComboBox    item={item} key={item.Id}/>);break;
		     		case 1301:childrens.push(<Table     	   item={item} key={item.Id}/>);break;
		     		case 1302:childrens.push(<Table     	   item={item} key={item.Id}/>);break;
		     		case 1306:childrens.push(<Table     	   item={item} key={item.Id}/>);break;
		     		case 1307:childrens.push(<Table     	   item={item} key={item.Id}/>);break;
		     		case 1308:childrens.push(<Table     	   item={item} key={item.Id}/>);break;
		     		case 1403:childrens.push(<Button 		   item={item} key={item.Id}/>);break;
		     		case 1404:childrens.push(<Button 		   item={item} key={item.Id}/>);break;
		     		case 1405:childrens.push(<Button 		   item={item} key={item.Id}/>);break;
		     		case 1407:childrens.push(<Button 		   item={item} key={item.Id}/>);break;
		     		case 1408:childrens.push(<Button 		   item={item} key={item.Id}/>);break;
		     		case 1423:childrens.push(<Button 		   item={item} key={item.Id}/>);break;
		     		case 1602:childrens.push(<CheckBoxComboBox item={item} parentId={this.props.item.Id} key={item.Id} />);break;
		     	}
		     
		    }.bind(this));
		    /*布局*/
		    var unitClass="";
		    if (this.props.isHidden) {
		    	unitClass="hide";
		    }else{
		    	unitClass="show";
		    }
		    switch(this.props.item.LayoutFormatType){
		    		case 1:unitClass+=" horizontal";break;
		    		default:break;
		    }
		    /*布局*/
		    var listClass=""
   			switch(this.props.item.LayoutType){
		    		case 4:listClass="horizontal";break;
		    		case 2:listClass="virtical";break;
		    		default:listClass="";break;
		    }
		    //控件类型
		    var tag;
		    switch(this.props.item.ControlType){
		    		case 1005:tag=<TitleTag item={this.props.item}/>;break;
		    		default: tag=<NormalTag item={this.props.item}/>;break;		    		
		    }
			return(
				<div className={unitClass}>
					{tag}
					<div className={listClass}>
					{childrens}
					</div>
					<div className="virtical">
						{groups}
					</div>
				</div>
				)
	}
})

//操作按钮
var OprareBox=React.createClass({
	render:function(){
		var buttons=this.props.item.Children.map(function(item){
					return(<Button item={item} key={item.Id}  handleSave={this.props.handleSave}/>)
		}.bind(this))
		return(
			<div className="oprate-box">
				{buttons}
			</div>
			)
	}
})
var RadioCommbobox=React.createClass({
	render:function(){
		var list=this.props.item.Children.map(function(item){
			return(<NormalComboBox item={item} key={item.Id}/>)
		})
		return(
			<div>
				<SingleChoice i={this.props.i} handleRadioOnChange={this.props.handleRadioOnChange} name={this.props.parentId} item={this.props.item}/>
				{list}
			</div>
			)
	}
})

//以下为基础控件

//标题标签
var TitleTag=React.createClass({
	render:function(){
			return(
			<div className="title-tag">{this.props.item.Name}</div>
			)	
		}
})
//默认标签
var NormalTag=React.createClass({
	render:function(){
			if (this.props.item.Children.length>0) {
				//递归调用默认标签，如培养基： 温度35℃ 时间18-24h 环境（5%CO2）此类型。
				var normalTags=this.props.item.Children.map(function(item){
					if (item.ControlType==1000) {
						return(<NormalTag item={item} key={item.Id}/>)
					}

				});
				return(
					<span className="normal-tag">{this.props.item.Name} {normalTags}</span>)
			}else{
				return(<span className="normal-tag">{this.props.item.Name}</span>)
			}
			
		
	}
})
//默认单选
var SingleChoice=React.createClass({
	handleRadioOnChange:function(){
		this.props.handleRadioOnChange(this.props.i)
	},
	render:function(){
		var radioClass="item-radio";
		if (this.props.item.IsChecked) {
			radioClass="item-radio active";			
		}
		return(<span className="input-container"><span className={radioClass} name={this.props.parentId} onClick={this.handleRadioOnChange}>{this.props.item.Name}</span></span>)
	}
})

//单选按钮文本框
var RadioButtonText=React.createClass({
	handleRadioOnChange:function(){
		this.props.handleRadioOnChange(this.props.i)
	},
	render:function () {
		var radioClass="item-radio";
		if (this.props.item.IsChecked) {
			radioClass="item-radio item-radio-selected"
		}
		return(
			<div>
				<span className="input-container"><span className={radioClass} name={this.props.parentId} onClick={this.handleRadioOnChange}>{this.props.item.Name}</span></span>
				<span className="input-container"><input type="text" className="form-control normal-txt"/></span>
			</div>
			)
	}
})
//默认下拉框
var NormalComboBox=React.createClass({
	getInitialState:function(){
		return({
			selectedValue:this.props.item.SelectedCode==null?'':this.props.item.SelectedCode,
			dictCode:this.props.item.DictCode,
			valueFeild:'Code',
			textFeild:'Name',
			data:[]
		})
	},
	handleInputOnChange:function(event){
		var value=event.target.value;
		this.props.item.SelectedCode=value;
		this.setState({selectedValue:value})
	},
	componentDidMount:function () {
    	var dict=$("body").data( "dict");
    	this.setState({data:dict[this.state.dictCode].Value});
    },
	render:function(){
		var list=this.state.data.map(function(item){
			return(<NormalComboBoxItem value={item[this.state.valueFeild]} text={item[this.state.textFeild]} key={item[this.state.valueFeild]} />)
		}.bind(this));

		return(
			<select value={this.props.item.SelectedCode==null?'':this.props.item.SelectedCode} onChange={this.handleInputOnChange}>
				{list}
			</select>
			)
	}
})
var NormalComboBoxItem=React.createClass({
	render:function(){
		return(<option value={this.props.value} >{this.props.text}</option>)
	}
})
//默认文本框
var NormalTextFeild=React.createClass({
	getInitialState:function(){
		return({
			InputValue:this.props.item.InputValue==null?'':this.props.item.InputValue,
			ControlType:this.props.controlType
		})
	},
	handleInputOnChange:function(event){
		var value=event.target.value;
		switch(this.state.ControlType){
			case 1105:this.props.handleJudgeResistance(value,this.props.i);break;
		}
		this.setState({InputValue:value})
	},
	render:function(){
		return(<span className="input-container"><input type="text" className="form-control normal-txt" value={this.state.InputValue} onChange={this.handleInputOnChange}/></span>)
	}
})
//培养基文本框
var PetriDishControl=React.createClass({
	getInitialState:function(){
		return({
			IsChecked:this.props.item.IsChecked==null?'':this.props.item.IsChecked,
			InputValue:this.props.item.InputValue==null?'':this.props.item.InputValue,
		})
	},
	handleInputOnChange:function(name,event){
		var controlState={}
		controlState[name]=name=='InputValue'?event.target.value:event.target.checked;
		this.setState(controlState);
	},
	render:function(){
		var childrens=this.props.item.Children.map(function(item){
				return <NormalTag item={item} key={item.Id} />
			})
		//布局
		var childrenClass="";
		if (this.props.item.LayoutFormatType==1) {
			childrenClass="horizontal";
		}
		return(
			<div>
				<div  className="overflow">
					<span className="input-container"><input type="checkbox" defaultChecked={this.state.IsChecked} onChange={this.handleInputOnChange.bind(this,'IsChecked')}/>{this.props.item.Name}</span>
					<span className="input-container"><input type="text" className="form-control normal-txt" value={this.state.InputValue} onChange={this.handleInputOnChange.bind(this,'InputValue')}/></span>
				</div>
				<div className={childrenClass}>
					{childrens}
				</div>
			</div>
			)
	}
})
//多选按钮下拉框
var CheckBoxComboBox=React.createClass({
	render:function(){
		return(
			<div>
				<span className="input-container"><input type="checkbox"/>{this.props.item.Name}</span>
				<select>
					<option value="1">阴性</option>
					<option value="2">阳性</option>
				</select>
			</div>
			)
	}
})
// 表格
var Table=React.createClass({
	render:function(){
		var rows=this.props.item.Children.map(function(item){
			return(<TableRow item={item} key={item.Id}></TableRow>)
		})
		return(
			<table className="normal-table"><tbody>{rows}</tbody></table>
			)
	}
})
//行
var TableRow=React.createClass({
	getInitialState:function(){
		return({
			Children:this.props.item.Children
		})
	},
	handleJudgeResistance(value,index){
		var state={},breakPointRange;
		state['Children']=this.state.Children.map(function(item,i){
			if (i==index-1) {
				breakPointRange=item.Name;
			}else if (i==index+1) {
				item.SelectedCode=this.getAntibioticResultMapCode(breakPointRange,value);
			}
			return item;
		}.bind(this))
		this.setState(state);
	},
	getAntibioticResultMapCode: function (breakPointRange, testValue) {
        var breakPointRangeArray = breakPointRange.match(/\d+/g);
        var resultCode = 0;
        if (/^[1-9]+\d*$/.test($.trim(testValue))) {
            testValue = parseInt(testValue);
            if (/^\d+-\d+$/.test(breakPointRange)) {
                if (testValue < parseInt(breakPointRangeArray[0])) {
                    resultCode = 2;
                } else if (testValue > parseInt(breakPointRangeArray[1])) {
                    resultCode = 1;
                } else {
                    resultCode = 3;
                }

            } else if (/^≥\d+$/.test(breakPointRange)) {
                if (testValue < parseInt(breakPointRangeArray[0])) {
                    resultCode = 2;
                } else {
                    resultCode = 1;
                }
            } else if (/^≤\d+$/.test(breakPointRange)) {
                if (testValue > parseInt(breakPointRangeArray[0])) {
                    resultCode = 1;
                } else {
                    resultCode = 2;
                }
            } else if (/^≥\d+≤\d+$/.test(breakPointRange)) {
                if (testValue <= parseInt(breakPointRangeArray[1])) {
                    resultCode = 2;
                } else if (testValue >= parseInt(breakPointRangeArray[0])) {
                    resultCode = 1;
                }
            }
        } else {
            if (/^\+$/.test(testValue)) {
                resultCode = 5;
            } else if (/^\-$/.test(testValue)) {
                resultCode = 4;
            } else {
                resultCode = 0;
            }
        }
        return resultCode.toString();
    },
	render:function(){
		var name=this.props.item.Name;
		var colums=this.state.Children.map(function(item,i){
			if (i==5) {
				console.log(JSON.stringify(item))
			}
			if (name=="标题行") {
				return(<TableHeadColum item={item} key={item.Id}/>)
			}else{
				return(<TableColum i={i} item={item} key={item.Id} handleJudgeResistance={this.handleJudgeResistance}/>)
			}

		}.bind(this))
		return(<tr>{colums}</tr>)
	}
})
//列
var TableColum=React.createClass({
	render:function(){
		var tdContent="",item=this.props.item;
		switch(item.ControlType){
			case 1100:tdContent=(<NormalTextFeild item={item} key={item.Id} />);break;
			case 1105:tdContent=(<NormalTextFeild item={item} key={item.Id} controlType={item.ControlType} handleJudgeResistance={this.props.handleJudgeResistance} i={this.props.i}/>);break;
			case 1200:tdContent=(<NormalComboBox item={item} key={item.Id} />);break;
			default:tdContent=item.Name;break;
		}
		return(<td>{tdContent}</td>)
	}
});
//表头
var TableHeadColum=React.createClass({
	render:function(){
		return(<th>{this.props.item.Name}</th>)
	}
});
//Button
var Button=React.createClass({
	render:function(){
		return(
			<span className="input-container"><input type="button" className="oprate-btn" onClick={this.props.handleSave} value={this.props.item.Name}/></span>
			)
	}
});

//InputComboBox
var InputComboBox=React.createClass({
	getInitialState:function(){
		return({
			paneVisible:false,
			valueFeild:'Code',
			textFeild:'Name',
			filterText:'',
			dictCode:this.props.item.DictCode,
			inputValue:this.props.item.InputValue==null?'':this.props.item.InputValue,
			data:[{Code:1,Name:'未获取相关字典'}]
			
		})
	},
    handleComboboxClick:function(){
    	if (this.state.paneVisible) {
    		this.setState({paneVisible:false})
    	}else{
    		this.setState({paneVisible:true})
    	}
    },
    handlePaneItemClick:function(item){
    	this.setState({paneVisible:false,InputValue:item[this.state.textFeild]})
    },
    handleInputOnChange:function(event){
    	var value=event.target.value;
    	this.setState({filterText:value,InputValue:value,paneVisible:true});
    },
    componentDidMount:function () {
    	var dict=$("body").data( "dict");
    	this.setState({data:dict[this.state.dictCode].Value});
    },
	render:function(){
		var paneClass=this.state.paneVisible==true?'pane active':'pane';
		var list=this.state.data.map(function(item){
			if (item[this.state.textFeild].indexOf(this.state.filterText)<0 && String.prototype.indexOf.call(item[this.state.valueFeild],this.state.filterText)<0) {
				return;
			}
			return (<ComboboxPaneItem item={item} key={item[this.state.valueFeild]} handlePaneItemClick={this.handlePaneItemClick} textFeild={this.state.textFeild}/>)
		}.bind(this));
		return(
			<div className="cstm-combo">
				<div className="cstm-container" onClick={this.handleComboboxClick}>
					<input type="text" className="form-control normal-txt" value={this.state.inputValue} onChange={this.handleInputOnChange}/>
					<span className="combo-arrow"></span>
				</div>
				<ul className={paneClass} >
					{list}
				</ul>
			</div>
			)
	}
})
var ComboboxPaneItem=React.createClass({
	handlePaneItemClick(){
		this.props.handlePaneItemClick(this.props.item)
	},
	render:function(){
		return(<li className="pane-item" onClick={this.handlePaneItemClick}>{this.props.item[this.props.textFeild]}</li>)
	}
})

