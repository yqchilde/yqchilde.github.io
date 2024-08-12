<template>
    <div>已完成「宝箱达人」轮数：{{ data.totalNumberRounds }}</div>
    <div>当前总积分{{ data.totalScore }} 当前轮进度：{{ data.currentRoundProgress }} / 8000，距离下一轮：8000，处于第{{ data.currentRound }}轮，第{{ rewardStage }}奖励阶段</div>
    <div>最后开箱进度：0/10 青铜宝箱</div>
    <div>累计使用宝箱数量</div>
    <div>
        青铜宝箱：{{ data.qingTongChest }}
        黄金宝箱：{{ data.huangJinChest }}
        铂金宝箱：{{ data.bojinChest }}
        钻石宝箱：{{ data.zuanShiChest }}
        木质宝箱：{{ data.muZhiChest }}
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';

onMounted(() => {
    startCalculate();
});

const data = reactive({
    totalNumberRounds: 0,        // 总轮数
    currentRoundProgress: 0,     // 当前轮进度
    muZhiChest: 100,             // 木质宝箱
    qingTongChest: 200,          // 青铜宝箱
    huangJinChest: 300,          // 黄金宝箱
    bojinChest: 400,             // 铂金宝箱
    zuanShiChest: 0,             // 钻石宝箱
    jinDuScore: 66,              // 进度积分
    totalScore: 0,               // 总积分
});

// 宝箱分数与类型的映射表
const chestTypes = [
    { index: 1, points: 10, box: "青铜宝箱" },
    { index: 2, points: 20, box: "青铜宝箱" },
    { index: 3, points: 30, box: "黄金宝箱" },
    { index: 4, points: 40, box: "铂金宝箱" },
    { index: 5, points: 80, box: "铂金宝箱" },
    { index: 6, points: 100, box: "铂金宝箱" },
    { index: 7, points: 70, box: "黄金宝箱" },
    { index: 8, points: 50, box: "铂金宝箱" },
    { index: 9, points: 100, box: "钻石宝箱" }
];

// 根据当前积分和索引计算获得的宝箱数量
function calculateChests(score: number, startingIndex: number = 0) {
    let remainingScore = score;
    let chestCounts = { qingTong: 0, huangJin: 0, bojin: 0, zuanShi: 0 };
    let nextIndex = startingIndex;

    for (let i = startingIndex; i < chestTypes.length; i++) {
        const chestType = chestTypes[i];
        if (remainingScore >= chestType.points) {
            remainingScore -= chestType.points;
            nextIndex = i + 1;

            switch (chestType.box) {
                case "青铜宝箱":
                    chestCounts.qingTong++;
                    break;
                case "黄金宝箱":
                    chestCounts.huangJin++;
                    break;
                case "铂金宝箱":
                    chestCounts.bojin++;
                    break;
                case "钻石宝箱":
                    chestCounts.zuanShi++;
                    break;
            }
        } else {
            break;
        }
    }

    return { chestCounts, remainingScore, nextIndex };
}

// 根据输入的宝箱数量和进度积分计算总分
function chestCalculate(data: any) {
    let initialScore = data.muZhiChest 
                    + 10 * data.qingTongChest 
                    + 20 * data.huangJinChest 
                    + 50 * data.bojinChest 
                    + data.jinDuScore;
    let remainingScore = initialScore;

    let result = calculateChests(remainingScore);

    data.muZhiChest = data.muZhiChest;
    data.qingTongChest += result.chestCounts.qingTong;
    data.huangJinChest += result.chestCounts.huangJin;
    data.bojinChest += result.chestCounts.bojin;
    data.zuanShiChest += result.chestCounts.zuanShi;

    // 继续处理剩余的积分
    let additionalResult = calculateChests(
        data.muZhiChest + 10 * data.qingTongChest + 20 * data.huangJinChest + 50 * data.bojinChest + result.remainingScore,
        result.nextIndex
    );

    data.qingTongChest += additionalResult.chestCounts.qingTong;
    data.huangJinChest += additionalResult.chestCounts.huangJin;
    data.bojinChest += additionalResult.chestCounts.bojin;
    data.zuanShiChest += additionalResult.chestCounts.zuanShi;

    // 计算总分和轮次
    let totalScore = data.muZhiChest 
                   + 10 * data.qingTongChest 
                   + 20 * data.huangJinChest 
                   + 50 * data.bojinChest;

    data.totalNumberRounds = Math.floor(totalScore / 8000);
    data.currentRoundProgress = totalScore % 8000;
}

// 启动计算
function startCalculate() {
    console.log("开始计算");
    chestCalculate(data);
}
</script>

<style scoped></style>