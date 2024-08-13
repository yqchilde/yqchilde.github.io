<template>
    <div style="margin-top: 100px;">已完成「宝箱达人」轮数：{{ data.totalNumberRounds }}</div>
    <div>当前总积分{{ data.totalScore }} 当前轮进度：{{ data.currentRoundProgress }} / 8000，距离下一轮：8000，处于第{{ }}轮，第{{ }}奖励阶段</div>
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
import { reactive, onMounted, toRaw } from 'vue';

onMounted(() => {
    startCalculate();
});

interface ChestData {
    totalNumberRounds: number,        // 总轮数
    currentRoundProgress: number,     // 当前轮进度
    muZhiChest: number,               // 木质宝箱
    qingTongChest: number,            // 青铜宝箱
    huangJinChest: number,            // 黄金宝箱
    bojinChest: number,               // 铂金宝箱
    zuanShiChest: number,             // 钻石宝箱
    jinDuScore: number,               // 进度积分
    totalScore: number,               // 总积分   
    type: number,                     // 索引
    retType?: string,                 // 索引
}

const data = reactive<ChestData>({
    totalNumberRounds: 0,           // 总轮数
    currentRoundProgress: 0,        // 当前轮进度
    muZhiChest: 100,                // 木质宝箱
    qingTongChest: 200,             // 青铜宝箱
    huangJinChest: 300,             // 黄金宝箱
    bojinChest: 400,                // 铂金宝箱
    zuanShiChest: 0,                // 钻石宝箱
    jinDuScore: 88,                 // 进度积分
    totalScore: 0,                  // 总积分
    type: 1,                        // 索引
    retType: '10 青铜宝箱'
});

// 宝箱分数与类型的映射表
const chestTypes = [
    "10 青铜宝箱", "20 青铜宝箱", "30 黄金宝箱", "40 铂金宝箱", "80 铂金宝箱", "100 铂金宝箱", "70 黄金宝箱", "50 铂金宝箱", "100 钻石宝箱"
];

function o(...n: any) {
    let totalScore = arguments[0];
    let type = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
    let i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
    let u = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0;
    let totalScoreWithoutJinDu = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0;

    console.log("宝箱积分:", n, type, " 任务索引：", u);

    var boxes = [
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

    let qingtongChestCount = 0;
    let huangjinChestCount = 0;
    let bojinChestCount = 0;
    let zuanshiChestCount = 0;
    let selectType = type;
    let totalScoreS = totalScore;
    for (var t = totalScoreWithoutJinDu, isCompleted = false, b = 0; totalScoreS >= 10 && !isCompleted;) {
        for (var curType = selectType; curType < boxes.length; curType++) {
            if (!(totalScoreS >= boxes[curType].points)) {
                b = curType;
                isCompleted = true;
                break
            }
            switch (boxes[curType].box) {
                case "青铜宝箱":
                    qingtongChestCount++, totalScoreS -= boxes[curType].points;
                    break;
                case "黄金宝箱":
                    huangjinChestCount++, totalScoreS -= boxes[curType].points;
                    break;
                case "铂金宝箱":
                    bojinChestCount++, totalScoreS -= boxes[curType].points;
                    break;
                case "钻石宝箱":
                    zuanshiChestCount++, totalScoreS -= boxes[curType].points
            }
        }
        selectType = 0
    }

    var y = u;
    if (i)
        for (var c = [1000, 1000, 2000, 2000, 2000], v = y; v < c.length; v++) {
            if (!(t >= c[v])) {
                y = v;
                break
            }
            t -= c[v], qingtongChestCount += 10, 4 == v && (v = -1);
        }
    console.log("宝箱积分转化宝箱数量:", "青铜宝箱:", qingtongChestCount, "黄金宝箱:", huangjinChestCount, "铂金宝箱:", bojinChestCount, "钻石宝箱:", zuanshiChestCount, "余分：", totalScoreS, " 索引：", b);
    var d = [qingtongChestCount, huangjinChestCount, bojinChestCount, zuanshiChestCount, totalScoreS, b, y, t];
    return d
}

// 根据当前积分和索引计算获得的宝箱数量
function chestsCalculate(n: ChestData) {
    let totalScore = n.muZhiChest + 10 * n.qingTongChest + 20 * n.huangJinChest + 50 * n.bojinChest + n.jinDuScore;
    console.log("1. 总积分：", totalScore)

    let totalScoreWithoutJinDu = n.muZhiChest + 10 * n.qingTongChest + 20 * n.huangJinChest + 50 * n.bojinChest;
    let i = o(totalScore, n.type, !0, 0, totalScoreWithoutJinDu);


    console.log("result==> ", i);

    // let u = n.muZhiChest;
    let muZhiChest = n.muZhiChest;
    // let g = i[0] + n.qingTongChest;
    let qingTongChest = i[0] + n.qingTongChest;
    // let t = n.huangJinChest + i[1];
    let huangJinChest = n.huangJinChest + i[1];
    // let r = n.bojinChest + i[2];
    let bojinChest = n.bojinChest + i[2];
    // let h = i[3];
    let zuanShiChest = i[3];
    // let l = i[4];
    let jinDuScore = i[4];
    // let f = i[5];
    let typ = i[5];
    for (totalScoreWithoutJinDu = i[7]; i[0] > 0 || i[1] > 0 || i[2] > 0 || i[3] > 0;) {
        var j = 10 * i[0] + 20 * i[1] + 50 * i[2] + i[4];
        totalScoreWithoutJinDu += 10 * i[0] + 20 * i[1] + 50 * i[2];
        // console.log("jisuanfen:", a, "索引:", i[6]);

        i = o(j, typ, true, i[6], totalScoreWithoutJinDu);
        qingTongChest += i[0];
        huangJinChest += i[1];
        bojinChest += i[2];
        zuanShiChest += i[3];
        jinDuScore = i[4];
        typ = i[5];
        totalScoreWithoutJinDu = i[7];
    }
    var s = {
        mu: muZhiChest,
        qing: qingTongChest,
        huangjin: huangJinChest,
        bojin: bojinChest,
        zuanshi: zuanShiChest,
        jindu: jinDuScore,
        type: typ,
        fen: totalScoreWithoutJinDu = muZhiChest + 10 * qingTongChest + 20 * huangJinChest + 50 * bojinChest
    };
    // console.log("===array:", s)
    return s;
}


// 启动计算
function startCalculate() {
    let t = chestsCalculate(data);

    console.log('t.fen ', t.fen)


    let a = t.fen % 8000;
    let o = 1;

    switch (true) {
        case (a >= 1000 && a < 2000):
            o = 2;
            break;
        case (a >= 2000 && a < 4000):
            o = 3;
            break;
        case (a >= 4000 && a < 6000):
            o = 4;
            break;
        case (a >= 6000 && a < 8000):
            o = 5;
            break;
    }

    let newData = {
        muZhiChest: t.mu,
        qingTongChest: t.qing,
        huangJinChest: t.huangjin,
        bojinChest: t.bojin,
        zuanShiChest: t.zuanshi,
        retjindu: t.jindu,
        retfen: a,
        totalNumberRounds: Math.ceil(t.fen / 8e3),
        jieduanshu: 0,
        retType: chestTypes[t.type],
        currentRoundProgress: t.fen / 8e3,
    }


    console.log('finish data: ', newData);
}
</script>

<style scoped></style>