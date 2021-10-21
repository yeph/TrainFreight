# TrainFreight

## 资源结构
* resources: 公共资源
* gameframe: 框架层资源
* subgame: 游戏资源

## 代码结构
* script/common: 工具类代码
* script/launcher: 启动器代码
* script/gameframe: 框架层代码
* script/subgame: 游戏层代码

## 各模块职责
* 启动器launcher: 负责装配框架模块和子游戏模块
* 框架层: 负责游戏资源加载，UI装配变换，游戏关卡回合之间转换，与App之间数据交互
* 游戏层: 负责游戏主逻辑（单一关卡，单一回合），游戏数据统计

## 框架层与游戏层的Bridge桥接指南
* 框架层继承实现`./launcher/AbFrameBridge`，游戏层继承实现`./launcher/AbGameBridge`，桥均以单类模型实现。继承的`initXXX()`方法实现模块初始化和界面初始化工作。
* 模块之间信息交换通过`bridge.sendMessage()`方法，模块需要针对消息事件新建`Handler`类，然后使用`bridge.registerHandler()`和`bridge.unregisterHandler()`添加处理对象。

## 模块消息说明
* ### 框架层处理消息(待定)
    * roundover: 回合结束
    * gameover: 游戏结束
    * changescore(val): 得分变化
    * changetime(val): 倒计时变化
* ### 游戏层处理消息(待定)
    * initgame: 初始化游戏，创建游戏背景层
    * showguide(isFirst)->callback: 显示引导层，用户点击按钮后回调
    * startgame: 游戏开始
    * stopgame->callback: 游戏结束，游戏离场后回调
    * pausegame: 游戏暂停
    * resumegame: 游戏开始
    * cleangame: 释放游戏资源，引导层和游戏层
    * timeover: 倒计时结束
