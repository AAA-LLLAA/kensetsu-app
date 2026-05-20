/* =========================
   200以上の勘定科目
========================= */

const accounts = [

"現金",
"小口現金",
"当座預金",
"普通預金",
"通知預金",
"定期預金",
"別段預金",
"受取手形",
"完成工事未収入金",
"有価証券",
"未成工事支出金",
"材料",
"貯蔵品",
"前渡金",
"貸付金",
"手形貸付金",
"前払保険料",
"前払地代",
"前払家賃",
"前払利息",
"未収家賃",
"未収利息",
"未収手数料",
"営業外受取手形",
"未収入金",
"立替金",
"仮払金",
"仮払法人税等",
"仮払消費税",
"未収消費税",
"貸倒引当金",
"建物",
"構築物",
"機械装置",
"船舶",
"車両運搬具",
"工具器具",
"備品",
"減価償却累計額",
"土地",
"建設仮勘定",
"のれん",
"特許権",
"借地権",
"実用新案権",
"電話加入権",
"施設利用権",
"投資有価証券",
"出資金",
"長期貸付金",
"破産債権、更生債権等",
"不渡手形",
"長期前払費用",
"差入保証金",
"差入有価証券",
"株式交付費",
"社債発行費",
"支払手形",
"工事未払金",
"借入金",
"手形借入金",
"当座借越",
"未払金",
"未払地代",
"未払家賃",
"未払利息",
"未払配当金",
"未払法人税等",
"未成工事受入金",
"預り金",
"前受家賃",
"前受地代",
"前受利息",
"仮受金",
"仮受消費税",
"未払消費税",
"賞与引当金",
"修繕引当金",
"完成工事補償引当金",
"営業外支払手形",
"社債",
"長期借入金",
"長期未払金",
"退職給付引当金",
"保証債務",
"資本金",
"事業主借勘定",
"事業主貸勘定",
"新株式申込証拠金",
"資本剰余金",
"資本準備金",
"株式払込剰余金",
"資本金減少差益",
"合併差益",
"利益剰余金",
"利益準備金",
"新築積立金",
"配当平均積立金",
"減債積立金",
"別途積立金",
"繰越利益剰余金",
"受取利息",
"受取地代",
"完成工事高",
"有価証券利息",
"受取配当金",
"受取家賃",
"受取手数料",
"有価証券売却益",
"仕入割引",
"雑収入",
"償却債権取立益",
"貸倒引当金戻入",
"完成工事補償引当金戻入",
"固定資産売却益",
"投資有価証券売却益",
"社債償還益",
"保険差益",
"保証債務取崩益",
"完成工事原価",
"役員報酬",
"役員賞与",
"給料手当",
"賞与引当金繰入額",
"退職金",
"退職給付引当金繰入額",
"法定福利費",
"福利厚生費",
"修繕維持費",
"事務用消耗品費",
"通信費",
"旅費交通費",
"水道光熱費",
"調査研究費",
"広告宣伝費",
"貸倒引当金繰入額",
"貸倒損失",
"交際費",
"寄付金",
"支払地代",
"支払家賃",
"減価償却費",
"租税公課",
"保険料",
"雑費",
"支払利息",
"社債利息",
"社債発行費償却",
"株式交付費償却",
"有価証券売却損",
"有価証券評価損",
"手形売却損",
"保証料",
"売上割引",
"材料評価損",
"棚卸減耗損",
"雑損失",
"前期工事補償費",
"固定資産売却損",
"固定資産除却損",
"投資有価証券売却損",
"投資有価証券評価損",
"社債償還損",
"災害損失",
"保証債務費用",
"材料費",
"労務費",
"外注費",
"経費",
"仮設材料費",
"人件費",
"動力用水光熱費",
"機械等経費",
"設計費",
"労務管理費",
"地代家賃",
"従業員給料手当",
"事務用品費",
"通信交通費",
"補償費",
"出張所等経費配賦額",
"工事間接費",
"施工部門費",
"補助部門費",
"仮設部門費",
"機械部門費",
"車両部門費",
"工事間接費配賦差異",
"部門費配賦差異"

];

/* =========================
   問題テンプレ
========================= */

const templates = [

{

text:(a,b)=>
`完成工事に係る請負代金
${a.toLocaleString()}円のうち、
${b.toLocaleString()}円が
当座預金口座へ振り込まれ、
残額は完成工事未収入金
とした。`,

debitAccounts:[
"当座預金",
"完成工事未収入金"
],

debitAmounts:(a,b)=>
[b,a-b],

creditAccounts:[
"完成工事高"
],

creditAmounts:(a)=>
[a],

explanation:
"入金分は当座預金、
残額は完成工事未収入金。"

},

{

text:(a,b)=>
`工事用材料
${a.toLocaleString()}円を
掛けで購入し、
運搬費
${b.toLocaleString()}円を
現金で支払った。`,

debitAccounts:[
"材料",
"通信費"
],

debitAmounts:(a,b)=>
[a,b],

creditAccounts:[
"工事未払金",
"現金"
],

creditAmounts:(a,b)=>
[a,b],

explanation:
"材料購入と運搬費支払の複合仕訳。"

},

{

text:(a,b)=>
`社債
${a.toLocaleString()}円を
発行し、
発行費
${b.toLocaleString()}円を
現金で支払った。`,

debitAccounts:[
"現金",
"社債発行費"
],

debitAmounts:(a,b)=>
[a-b,b],

creditAccounts:[
"社債"
],

creditAmounts:(a)=>
[a],

explanation:
"社債発行費は区分処理する。"

}

];

/* =========================
   ランダム
========================= */

function rand(max){

  return Math.floor(
    Math.random()*max
  );

}

function amount(){

  return Math.floor(
    (Math.random()*900+100)
  ) * 1000;

}

/* =========================
   問題生成
========================= */

const questions = [];

for(let i=0;i<5;i++){

  const t =
  templates[
    rand(templates.length)
  ];

  const a = amount();

  const b =
  Math.floor(a*0.7);

  questions.push({

    text:t.text(a,b),

    debitAccounts:
    t.debitAccounts,

    debitAmounts:
    t.debitAmounts(a,b),

    creditAccounts:
    t.creditAccounts,

    creditAmounts:
    t.creditAmounts(a,b),

    explanation:
    t.explanation

  });

}

/* =========================
   必須勘定抽出
========================= */

let required = [];

questions.forEach(q=>{

  required.push(
    ...q.debitAccounts
  );

  required.push(
    ...q.creditAccounts
  );

});

required =
[...new Set(required)];

/* =========================
   24科目までランダム追加
========================= */

while(required.length < 24){

  const r =
  accounts[
    rand(accounts.length)
  ];

  if(!required.includes(r)){

    required.push(r);

  }

}

/* =========================
   シャッフル
========================= */

required.sort(
()=>Math.random()-0.5
);

/* =========================
   A〜X割当
========================= */

const letters =
"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
.split("");

const mapping = {};

required.forEach((a,i)=>{

  mapping[
    letters[i]
  ] = a;

});

/* =========================
   勘定科目表示
========================= */

const list =
document.getElementById(
"account-list"
);

required.forEach((a,i)=>{

  list.innerHTML += `

  <div class="account-item">

    <b>${letters[i]}</b>

    ${a}

  </div>

  `;

});

/* =========================
   問題表示
========================= */

const quiz =
document.getElementById(
"quiz"
);

questions.forEach((q,i)=>{

  quiz.innerHTML += `

  <div class="q">

    <h3>
    第${i+1}問
    </h3>

    <p>
    ${q.text}
    </p>

    <div class="answer-row">

      <span>借方</span>

      <input
      type="text"
      maxlength="1"
      id="d${i}"
      >

      <input
      type="number"
      id="da${i}"
      >

      <span>貸方</span>

      <input
      type="text"
      maxlength="1"
      id="c${i}"
      >

      <input
      type="number"
      id="ca${i}"
      >

    </div>

    <div id="r${i}"></div>

  </div>

  `;

});

/* =========================
   採点
========================= */

function check(){

  let score = 0;

  questions.forEach((q,i)=>{

    const d =
    document
    .getElementById(`d${i}`)
    .value
    .toUpperCase();

    const c =
    document
    .getElementById(`c${i}`)
    .value
    .toUpperCase();

    const da =
    Number(
      document
      .getElementById(`da${i}`)
      .value
    );

    const ca =
    Number(
      document
      .getElementById(`ca${i}`)
      .value
    );

    const debitCorrect =

    mapping[d]
    ===
    q.debitAccounts[0];

    const creditCorrect =

    mapping[c]
    ===
    q.creditAccounts[0];

    const amountCorrect =

    da
    ===
    q.debitAmounts[0]

    &&

    ca
    ===
    q.creditAmounts[0];

    const correct =

    debitCorrect
    &&
    creditCorrect
    &&
    amountCorrect;

    if(correct){

      score++;

      document
      .getElementById(`r${i}`)
      .innerHTML =

      `<div class="correct">

      ⭕ 正解

      <br><br>

      ${q.explanation}

      </div>`;

    }else{

      const debitLetter =
      Object.keys(mapping)
      .find(
      k=>
      mapping[k]
      ===
      q.debitAccounts[0]
      );

      const creditLetter =
      Object.keys(mapping)
      .find(
      k=>
      mapping[k]
      ===
      q.creditAccounts[0]
      );

      document
      .getElementById(`r${i}`)
      .innerHTML =

      `<div class="wrong">

      ❌ 不正解

      <br><br>

      借方：
      ${debitLetter}
      /
      ${q.debitAmounts[0]
      .toLocaleString()}

      <br><br>

      貸方：
      ${creditLetter}
      /
      ${q.creditAmounts[0]
      .toLocaleString()}

      <br><br>

      ${q.explanation}

      </div>`;

    }

  });

  document
  .getElementById("score")
  .innerHTML =

  `得点：
  ${score}/5`;

}

/* =========================
   次の問題
========================= */

function nextQuiz(){

  location.reload();

}