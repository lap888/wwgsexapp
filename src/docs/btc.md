# btc 用到密码学两个  密码学 的两个功能 hash  签名

# hash 碰撞💥

256 hash 2 256 次方

输入无限大 输出范围有限

# hiding 计算过程单项

x-> h(x)

h(x+nonce)

# digital commitment / digtal equivalent oft a sealed envelope ()

# btc 额外要求

puzzle friendly

x h(x)不可预测

## h(block header) <= target

工作量证明

difficult to solve , but easy to verify

## btc hash函数 用的是 sha-256 (三特性)


--
## 签名

开户 任何人都可以 不需要 去中心化机构

方式 创立一个公私钥的对（public key,private key）来源于非对称的加密体系（ a symmentric encryption）

encyption key 

网络窃听

## a good source of randomness

## hash pointers

链表 和区块链区别

hash 指针

口<-口<-口<-口<-口<-口<-口<-口<-口<-...口<-口<-

genesis block

most recent block

每个区块都有一个指向前一个区块的hash指针

如何 取指针

前一个区块所有内容 取hash

可以得出  temper-evident log

篡改了一个区块的内容 后面所有的都得该 一动则全动

## 节点 -- 去中心化  -- 恶意节点

## merkle tree 

## binary tree

区别  hash 指针 代替普通指针 

### block header

### block body



 

