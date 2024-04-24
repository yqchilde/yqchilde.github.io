---
title: "MacOS-如何删除Free Space，使得APFS容器将Free Space占用"
description: "本文记载如果将一个APFS容器删除，并将与其剩余空间合并。"
date: 2021-10-09 08:02:40
tags: ["MacOS"]
---

# MacOS-如何删除Free Space，使得APFS容器将Free Space占用

::: tip 背景
事故的开始是由于我要从MacOS11.6升级到MacOS12（追新的强迫症），从而导致再换了支持MacOS12的EFI之后无法开机（卡三分之一进度条后黑屏），随后想着去重装11.6系统（在12系统上修了半天EFI还是无果，觉得浪费时间不想继续折腾），在重装时为了保全文件选择磁盘分一半空间去安装11.6，这样另一半还是原来那个无法开机的系统，等11.6开机后再将原来的文件复制过来。。。等到原来的文件移动完毕之后，准备去删除原来的空间，与新的系统盘合并。但是在删除时，出现了无法删除的问题，如下：
:::

![](https://pic.yqqy.top/blog/202110081041194.jpg "pic1")

![](https://pic.yqqy.top/blog/202110081041110.jpg "pic2")

## 操作步骤

1. 在终端输入 `diskutil list`

```bash
bobo@Mac:~ » diskutil list
/dev/disk0 (internal, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      GUID_partition_scheme                        *512.1 GB   disk0
   1:                        EFI EFI                     209.7 MB   disk0s1
   2:                 Apple_APFS Container disk2         271.6 GB   disk0s2
   3:                 Apple_APFS Container disk1         240.3 GB   disk0s3

/dev/disk1 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +240.3 GB   disk1
                                 Physical Store disk0s3
   1:                APFS Volume MacOS - 数据             94.2 GB    disk1s1
   2:                APFS Volume Preboot                 284.3 MB   disk1s2
   3:                APFS Volume Recovery                622.8 MB   disk1s3
   4:                APFS Volume VM                      1.1 GB     disk1s4
   5:                APFS Volume MacOS                   15.3 GB    disk1s5
   6:              APFS Snapshot com.apple.os.update-... 15.3 GB    disk1s5s1
```

2. 输入 `diskutil apfs deleteContainer disk0s2` 删除 Apple_APFS Container disk2 的空间

3. 输入`diskutil list` 查看删除后的空间

```bash
bobo@Mac:~ » diskutil list
/dev/disk0 (internal, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      GUID_partition_scheme                        *512.1 GB   disk0
   1:                        EFI EFI                     209.7 MB   disk0s1
                      (free space)                       271.6 GB   -
   2:                 Apple_APFS Container disk1         240.3 GB   disk0s3

/dev/disk1 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +240.3 GB   disk1
                                 Physical Store disk0s3
   1:                APFS Volume MacOS - 数据             94.2 GB    disk1s1
   2:                APFS Volume Preboot                 284.3 MB   disk1s2
   3:                APFS Volume Recovery                622.8 MB   disk1s3
   4:                APFS Volume VM                      1.1 GB     disk1s4
   5:                APFS Volume MacOS                   15.3 GB    disk1s5
   6:              APFS Snapshot com.apple.os.update-... 15.3 GB    disk1s5s1
```

4. 输入`diskutil addpartition disk0s1 apfs NewAPFS 0` 创建一个新的`APFS容器`

5. 输入`diskutil list` 查看新增后的空间

```bash
bobo@Mac:~ » diskutil list
/dev/disk0 (internal, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      GUID_partition_scheme                        *512.1 GB   disk0
   1:                        EFI EFI                     209.7 MB   disk0s1
   2:                 Apple_APFS Container disk2         271.6 GB   disk0s4
   3:                 Apple_APFS Container disk1         240.3 GB   disk0s3

/dev/disk1 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +240.3 GB   disk1
                                 Physical Store disk0s3
   1:                APFS Volume MacOS - 数据             94.2 GB    disk1s1
   2:                APFS Volume Preboot                 284.3 MB   disk1s2
   3:                APFS Volume Recovery                622.8 MB   disk1s3
   4:                APFS Volume VM                      1.1 GB     disk1s4
   5:                APFS Volume MacOS                   15.3 GB    disk1s5
   6:              APFS Snapshot com.apple.os.update-... 15.3 GB    disk1s5s1
   
/dev/disk2 (synthesized):
 #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +271.6 GB   disk2
                                 Physical Store disk0s4
   1:                APFS Volume NewAPFS                 995.3 KB   disk2s1                 
```

6. 使用[asr](https://en.wikipedia.org/wiki/Apple_Software_Restore)工具将第一次挂载盘中的BaseSystem.dmg恢复到空的挂载镜像中，命令如下：

   `sudo asr --source /dev/disk1s5s1 --target /dev/disk2 --erase`

7. 重启电脑，**用新的挂载镜像启动**

8. 输入`diskutil list` 查看当前空间

```bash
bobo@Mac:~ » diskutil list
/dev/disk0 (internal, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      GUID_partition_scheme                        *512.1 GB   disk0
   1:                        EFI EFI                     209.7 MB   disk0s1
   2:                 Apple_APFS Container disk1         271.6 GB   disk0s2
   3:                 Apple_APFS Container disk2         240.3 GB   disk0s3

/dev/disk1 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +271.6 GB   disk1
                                 Physical Store disk0s2
   1:                APFS Volume MacOS - 数据             94.2 GB    disk1s1
   2:                APFS Volume MacOS                   15.3 GB    disk1s2
   3:              APFS Snapshot com.apple.os.update-... 15.3 GB    disk1s2s1
   4:                APFS Volume Preboot                 284.3 MB   disk1s3
   5:                APFS Volume Recovery                622.8 MB   disk1s4
   6:                APFS Volume VM                      1.1 GB     disk1s5
   
/dev/disk2 (synthesized):
 #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +240.3 GB   disk2
                                 Physical Store disk0s3   
   1:                APFS Volume MacOS - 数据             94.2 GB    disk2s1
   2:                APFS Volume Preboot                 284.3 MB   disk2s2
   3:                APFS Volume Recovery                622.8 MB   disk2s3
   4:                APFS Volume VM                      1.1 GB     disk2s4
   5:                APFS Volume MacOS                   15.3 GB    disk2s5
```

9. 输入 `diskutil apfs deleteContainer disk2` 删除之前旧的的空间

10. 输入`diskutil apfs resizecontainer disk1 0`  回收可用空间，大功告成

## 参考

[How to make remove free space and make APFS container take it up](https://apple.stackexchange.com/questions/406962/how-to-make-remove-free-space-and-make-apfs-container-take-it-up/407055#407055)
