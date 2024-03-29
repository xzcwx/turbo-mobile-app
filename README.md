# turbo-mobile-app

---

## 简介

本项目收录有关于前端(移动端)项目的初始模板，项目使用与主流开源项目类似的父子模块化结构，此结构的诸多优点可以引用《代码大全2》这本书里的总结：

- 模块化和结构清晰：模块化，结构更清晰的代码，最直观的体验就是提高了代码的可读性和可维护性。
- 重用性提高：通过分离父子模块代码，可以更好地实现代码的重用，例如父模块的代码可以在多个子模块中被重复利用，减少了重复编写相似代码的工作量。
- 解耦和灵活性：父子模块分离可以帮助代码实现解耦，降低模块之间的依赖性，提高了代码的灵活性和可扩展性，使得系统更容易进行修改和升级。
- 单一职责原则：按照单一职责原则将父子模块分离可以使每个模块只负责一部分功能，降低了模块的复杂性，提高了代码的可测试性和可靠性。
- 团队协作和开发效率： 父子模块分离可以使不同团队成员专注于各自模块的开发工作，降低了开发过程中的冲突和合并问题，提高了团队协作效率。

项目模板包括 Uniapp、Taro 等目前主流前端框架，同时支持 Typescript，可以根据不同分支自行选择对应框架类型。

---
## 特征

- 注入前端新型 Turborepo 高热度技术，基于Rust语言开发的运行速度，加上增量构建、并行执行、任务管道等优点，大大提高项目编译速度与体验。🚀
- 与诸多耳熟能详的大型项目类似的父子模块化结构，不管是小型还是大型项目，统统没问题。🌈
- 多种框架类型的选择，移动端的开发技术选型轻而易举。🔥
- 使用快速的，节省磁盘空间的 pnpm 作为本模板的包管理工具。

---
## 快速开始

### 在运行之前

克隆项目后，请全局更改package.json下的name字段，将其更改成自己的项目名称，同时确保主包的 dependencies 与子包name字段匹配。
pnpm-lock.yaml 下的 dependencies 字段也要同步更改，但你也可以选择删除此文件，重新安装时会自动生成。

> 若并不是特别在意项目名称，此步骤可以忽略。

### 如何运行

```shell
# 如果没有安装pnpm的话
# npm i pnpm -g
pnpm install
pnpm start
```

---
## Uniapp 模板

若使用HBuilderX进行APP的打包，请确保项目生产打包HBuilderX为3.8.12，以保证其稳定性，开发时版本不作限制。

