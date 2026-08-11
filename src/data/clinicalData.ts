import { OsceSkill, StaticTerm } from '../types';

export const OSCE_SKILLS: OsceSkill[] = [
  {
    id: 'iv-cannulation',
    title: 'تركيب الكانيولا الوريدية (Peripheral IV Catheter)',
    category: 'الوصول الوريدي',
    videoUrl: 'https://youtu.be/R9gUCA8ACgk?si=m-fsIXtPbH2PvVNd',
    description: 'قائمة تدقيق رسمية معتمدة لتركيب القسطرة الوريدية الطرفية خطوة بخطوة مع الترجمة العربية.',
    steps: [
      "Introduce yourself as a student nurse and explain the procedure to the patient.||عرّف نفسك كممرض/ة متدرب/ة واشرح الإجراء للمريض.",
      "Identify the patient verbally using two identifiers and maintain privacy.||تحقق من هوية المريض بمعرّفين اثنين وحافظ على خصوصيته.",
      "Gather equipment and assess the extremities for a suitable insertion site.||جهّز الأدوات وقيّم الأطراف لاختيار مكان مناسب للإدخال.",
      "Check for any allergy to antiseptics, adhesives, or dressings.||تأكد من عدم وجود حساسية تجاه المطهرات أو اللاصقات.",
      "Wash hands and wear disposable gloves.||اغسل يديك وارتدِ القفازات.",
      "Apply the tourniquet proximal to the selected puncture site.||اربط الرباط الضاغط (Tourniquet) أعلى مكان الوكز المختار.",
      "Cleanse the site with an alcohol swab and let it dry completely without touching it again.||طهّر المكان بمسحة كحول واتركه يجف تماماً دون لمسه.",
      "Select the appropriate catheter size and open the sterile package.||اختر المقاس المناسب للقسطرة وافتح عبوتها المعقمة.",
      "Stabilize the skin distal to the site with your nondominant hand.||ثبّت الجلد أسفل المكان المختار بيدك غير المسيطرة.",
      "Hold the catheter at a 30° angle with the bevel facing upward and insert until blood return appears.||أمسك القسطرة بزاوية 30° مع اتجاه الشطبة للأعلى وأدخلها حتى ظهور ارتجاع الدم.",
      "Release the tourniquet, remove the needle, and attach the primed extension tubing.||حرر الرباط الضاغط، انزع الإبرة، وثبّت وصلة التمديد المجهزة.",
      "Dispose of the needle immediately in a sharps container.||تخلص من الإبرة فوراً في حاوية الأدوات الحادة.",
      "Flush with 3-5 ml normal saline while checking for signs of infiltration.||اغسل القسطرة بمحلول ملحي 3-5 مل مع ملاحظة أي علامات تسرب.",
      "Secure with an appropriate dressing and label it with date, time, and your name.||ثبّت بضماد مناسب واكتب عليه التاريخ والوقت واسمك.",
      "Remove gloves, wash hands, and document the procedure.||انزع القفازات، اغسل يديك، ووثّق الإجراء في ملف المريض."
    ]
  },
  {
    id: 'ng-tube',
    title: 'إدخال الأنبوب المعدي (Nasogastric Tube - NGT)',
    category: 'الجهاز الهضمي والتغذية',
    videoUrl: 'https://youtu.be/VgVWVjVf9A4?si=JAwIWQJg07jI_bD5',
    description: 'قائمة تدقيق رسمية معتمدة لإدخال الأنبوب الأنفي المعدي مع الترجمة العربية لكل خطوة.',
    steps: [
      "Introduce yourself, verify the doctor's order, and identify the patient using two identifiers.||عرّف نفسك، تأكد من أمر الطبيب، وتحقق من هوية المريض بمعرّفين.",
      "Explain the procedure and examine the nostrils to select the more patent one.||اشرح الإجراء وافحص فتحتي الأنف لاختيار الأكثر انفتاحاً.",
      "Position the patient in high Fowler's position (comatose patients: semi-Fowler's).||ضع المريض بوضعية فاولر العالية (أو نصف فاولر للمريض الغائب عن الوعي).",
      "Wash hands, wear gloves, and place a towel over the chest with tissues within reach.||اغسل يديك، ارتدِ القفازات، وضع فوطة على الصدر مع مناديل قريبة.",
      "Measure the tube length from nose to earlobe to xiphoid process (NEX) and mark it with tape.||قِس طول الأنبوب من الأنف للأذن ثم لعظم القص وضع علامة عليه.",
      "Lubricate the first 4 inches of the tube with water-soluble lubricant.||رطّب أول 10 سم من الأنبوب بمزلق مائي.",
      "Gently insert the tube into the nostril, aiming toward the back of the throat and down.||أدخل الأنبوب بلطف داخل فتحة الأنف باتجاه مؤخرة الحلق وللأسفل.",
      "When the patient feels the tube in the throat, flex the head toward the chest and have them swallow sips of water.||عند شعور المريض بالأنبوب في الحلق، اطلب منه إمالة رأسه للأمام والبلع مع رشفات ماء.",
      "If resistance is met, rotate the tube slowly; never force it. Withdraw immediately if breathing changes occur.||عند وجود مقاومة، أدر الأنبوب ببطء ولا تجبره؛ واسحبه فوراً عند أي تغير بالتنفس.",
      "Advance the tube until the taped mark is reached.||تابع إدخال الأنبوب حتى تصل العلامة الموضوعة.",
      "Confirm placement by aspirating gastric contents and checking pH, or by X-ray.||تأكد من وضع الأنبوب بسحب عصارة معدية وفحص الحموضة أو بالأشعة.",
      "Secure the tube with tape and instruct the patient about movements that could dislodge it.||ثبّت الأنبوب باللاصق وأرشد المريض عن الحركات التي قد تزيحه.",
      "Provide oral hygiene, remove gloves, and perform hand hygiene.||قدّم عناية للفم، انزع القفازات، واغسل يديك.",
      "Document date, time, reason for insertion, tube type, and the patient's tolerance.||وثّق التاريخ والوقت وسبب الإدخال ونوع الأنبوب ومدى تحمل المريض."
    ]
  },
  {
    id: 'sterile-dressing',
    title: 'غيار الجروح المعقم (Dry Sterile Dressing)',
    category: 'الرعاية الجراحية',
    videoUrl: 'https://youtu.be/KLgWGORKRX0?si=eUSnbitbAudv1pA5',
    description: 'قائمة تدقيق رسمية معتمدة لغيار الجروح المعقم مع الترجمة العربية لكل خطوة.',
    steps: [
      "Check the physician's order, wash hands, and gather equipment.||تأكد من أمر الطبيب، اغسل يديك، وجهّز الأدوات.",
      "Identify the patient, explain the procedure, and provide privacy exposing only the wound area.||تحقق من هوية المريض، اشرح الإجراء، ووفّر الخصوصية بكشف منطقة الجرح فقط.",
      "Don disposable gloves and remove the tape and soiled dressing.||ارتدِ قفازات غير معقمة وأزل اللاصق والضماد المتسخ.",
      "Examine the drainage for color, consistency, and odor; obtain a culture if ordered.||افحص الإفرازات من حيث اللون والقوام والرائحة، واسحب عينة زرع إن طُلب.",
      "Remove gloves, wash hands, and open the sterile dressing set and cleansing solution.||انزع القفازات، اغسل يديك، وافتح طقم الغيار المعقم والمحلول المطهر.",
      "Don sterile gloves and assess the wound (size, location, sutures, edema, complications).||ارتدِ قفازات معقمة وقيّم الجرح (الحجم، الموقع، الغرز، الوذمة، أي مضاعفات).",
      "Cleanse the wound from the cleanest area outward; never return to an already-cleaned area.||نظّف الجرح من المنطقة الأنظف للخارج، ولا تعد لمنطقة نظّفتها من قبل.",
      "Dry the wound with sterile gauze, then apply and secure a sterile dressing with tape.||جفّف الجرح بشاش معقم، ثم ضع الضماد المعقم وثبّته باللاصق.",
      "If a drain is present, cleanse around it carefully without dislodging it, and secure new dressings around it.||عند وجود مصرف، نظّف حوله بحذر دون إزاحته وثبّت ضمادات جديدة حوله.",
      "Return the patient to a comfortable position, remove gloves, and wash hands.||أعد المريض لوضعية مريحة، انزع القفازات، واغسل يديك.",
      "Document wound findings, label the dressing with date/time/signature, and report any wound problem.||وثّق نتائج فحص الجرح، ضع تاريخ ووقت وتوقيع على الضماد، وأبلغ عن أي مشكلة بالجرح."
    ]
  },
  {
    id: 'ampule-withdrawal',
    title: 'سحب الدواء من الأمبولة (Ampule)',
    category: 'تحضير الأدوية والحقن',
    videoUrl: 'https://youtu.be/mFKj3_Wk8m8?si=T9UdpN7u4DXniAKR',
    description: 'قائمة تدقيق رسمية معتمدة لسحب الدواء من الأمبولة الزجاجية بتقنية معقمة.',
    steps: [
      "Wash hands and wear gloves.||اغسل يديك وارتدِ القفازات.",
      "Tap the top chamber of the ampule gently until all fluid moves to the bottom chamber.||اطرق برفق أعلى الأمبولة حتى ينزل كل السائل للأسفل.",
      "Wrap a sterile gauze or alcohol wipe around the neck of the ampule.||لف شاش معقم أو مسحة كحول حول عنق الأمبولة.",
      "Snap the neck of the ampule away from your body and place it on a flat surface.||اكسر عنق الأمبولة بعيداً عن جسمك وضعها على سطح مستوٍ.",
      "Attach the needle to the syringe, keeping sterile technique throughout.||ثبّت الإبرة بالسرنجة مع الحفاظ على التعقيم طوال الوقت.",
      "Insert the needle into the center of the ampule without touching its rim, keeping the tip below the fluid level.||أدخل الإبرة في وسط الأمبولة دون لمس حافتها مع إبقاء طرفها تحت مستوى السائل.",
      "Aspirate the medication gently by pulling back the plunger.||اسحب الدواء برفق بسحب المكبس للخلف.",
      "Remove excess air from the syringe and recheck the needle.||أخرج الهواء الزائد من السرنجة وتحقق من الإبرة.",
      "Check the dosage in the syringe against the MAR and discard any unused medication.||تأكد من الجرعة مقارنة بسجل الأدوية وتخلص من أي دواء متبقٍ.",
      "Change the needle, label the syringe with patient and drug data, then wash hands.||غيّر الإبرة، ضع بطاقة على السرنجة ببيانات المريض والدواء، ثم اغسل يديك."
    ]
  },
  {
    id: 'vial-withdrawal',
    title: 'سحب الدواء من الفيال (Vial)',
    category: 'تحضير الأدوية والحقن',
    videoUrl: 'https://youtu.be/vJOuAGmDmNI?si=3u-1EFxUNFXVUuvZ',
    description: 'قائمة تدقيق رسمية معتمدة لسحب الدواء من الفيال بتقنية معقمة.',
    steps: [
      "Wash hands and wear gloves.||اغسل يديك وارتدِ القفازات.",
      "Remove the metal cap (new vial) or cleanse the rubber top with an alcohol wipe (used vial).||أزل الغطاء المعدني (فيال جديد) أو طهّر السدادة المطاطية بمسحة كحول (فيال مستخدم).",
      "Choose an appropriately sized syringe and draw air equal to the medication volume needed.||اختر سرنجة بحجم مناسب واسحب هواء بمقدار كمية الدواء المطلوبة.",
      "Insert the needle into the upright vial and inject the air into it.||أدخل الإبرة في الفيال وهو منتصب واحقن الهواء بداخله.",
      "Invert the vial, keep it at eye level with the needle bevel below the fluid, and withdraw the exact amount needed.||اقلب الفيال، حافظ على مستوى العين مع إبقاء شطبة الإبرة تحت السائل، واسحب الكمية المطلوبة بدقة.",
      "Expel any air from the syringe while the needle is still inside the inverted vial.||أخرج أي هواء من السرنجة والإبرة لا تزال داخل الفيال المقلوب.",
      "Check the amount of medication in the syringe, then turn the vial upright and remove the needle.||تحقق من كمية الدواء بالسرنجة، ثم أعد الفيال لوضعه الطبيعي وانزع الإبرة.",
      "Change the needle using sterile technique and dispose of the used one in a sharps container.||غيّر الإبرة بتقنية معقمة وتخلص من المستخدمة في حاوية الأدوات الحادة.",
      "Compare the medication in the syringe with the prescribed dosage.||قارن كمية الدواء بالسرنجة مع الجرعة الموصوفة.",
      "Wash hands after completing the procedure.||اغسل يديك بعد الانتهاء من الإجراء."
    ]
  },
  {
    id: 'im-injection',
    title: 'الحقن العضلي (Intramuscular Injection)',
    category: 'إعطاء الأدوية والحقن',
    videoUrl: 'https://youtu.be/vJOuAGmDmNI?si=3u-1EFxUNFXVUuvZ',
    description: 'قائمة تدقيق رسمية معتمدة لإعطاء الحقنة العضلية بأمان وتقنية Z-track.',
    steps: [
      "Check the patient's allergy history, wash hands, and wear non-sterile gloves.||تحقق من تاريخ الحساسية لدى المريض، اغسل يديك، وارتدِ قفازات غير معقمة.",
      "Follow the ten rights of medication administration and prepare the dose, expelling any air bubbles.||اتبع الحقوق العشرة لإعطاء الدواء وجهّز الجرعة مع إخراج فقاعات الهواء.",
      "Explain the procedure, check the ID band, position the patient, and provide privacy.||اشرح الإجراء، تحقق من سوار الهوية، ضع المريض بالوضعية المناسبة، ووفّر الخصوصية.",
      "Select the site using anatomic landmarks and cleanse it with an alcohol swab in a circular motion; let it dry.||حدد مكان الحقن بالمعالم التشريحية ونظّفه بحركة دائرية بمسحة كحول واتركه يجف.",
      "Hold the syringe in your dominant hand and pull the skin taut (Z-track technique) with the other.||أمسك السرنجة بيدك المسيطرة واسحب الجلد (تقنية Z-track) باليد الأخرى.",
      "Insert the needle quickly at a 90° angle (dartlike motion) into the deltoid or vastus lateralis.||أدخل الإبرة بسرعة بزاوية 90° (حركة سهم) في عضلة الدالية أو الفخذ الوحشية.",
      "Aspirate by pulling back the plunger; if blood appears, remove and discard the needle.||اسحب المكبس للتأكد من عدم وجود دم؛ فإن ظهر دم، انزع الإبرة وتخلص منها.",
      "If no blood appears, inject the medication slowly (about 10 seconds/ml).||إذا لم يظهر دم، احقن الدواء ببطء (حوالي 10 ثوانٍ/مل).",
      "Wait 10 seconds, then withdraw the needle smoothly at the same angle of insertion.||انتظر 10 ثوانٍ، ثم اسحب الإبرة بسلاسة بنفس زاوية الإدخال.",
      "Apply gentle pressure with dry sterile gauze without massaging the site.||اضغط برفق بشاش معقم جاف دون تدليك المكان.",
      "Discard the needle and syringe in a sharps container without recapping.||تخلص من الإبرة والسرنجة في حاوية الأدوات الحادة دون إعادة تغطية الإبرة.",
      "Position the patient comfortably, remove gloves, and wash hands.||ضع المريض بوضعية مريحة، انزع القفازات، واغسل يديك.",
      "Record the dosage, route, site, and time on the MAR, and inspect the site within 2-4 hours.||سجّل الجرعة والطريق والمكان والوقت بسجل الأدوية، وافحص المكان خلال 2-4 ساعات."
    ]
  },
  {
    id: 'hand-hygiene',
    title: 'غسل اليدين الروتيني (Hand Hygiene)',
    category: 'الوقاية من العدوى',
    videoUrl: 'https://youtu.be/G5-Rp-6FMCQ?si=sa-5sn1_P8h131wF',
    description: 'قائمة تدقيق رسمية معتمدة لغسل اليدين وفق معايير منظمة الصحة العالمية.',
    steps: [
      "Gather equipment, push long sleeves above the wrists, and remove rings or a watch.||جهّز الأدوات، ارفع الأكمام الطويلة فوق المعصمين، وأزل الخواتم أو الساعة.",
      "Turn on the water and wet your hands, keeping hands and forearms lower than the elbows.||افتح الماء وبلل يديك مع إبقاء اليدين والساعدين أسفل مستوى المرفقين.",
      "Apply soap and rub hands together, covering all surfaces of hands and fingers.||ضع الصابون وافرك يديك مع تغطية كل أسطح اليدين والأصابع.",
      "Rub palm to palm, then the back of each hand with the opposite palm.||افرك راحة بكف، ثم ظهر كل يد بكف اليد الأخرى.",
      "Rub palm to palm with fingers interlaced, then backs of fingers with opposing palms interlocked.||افرك راحة بكف مع تشبيك الأصابع، ثم ظهر الأصابع مع تشبيك الكفين.",
      "Rotationally rub each thumb clasped in the opposite palm.||افرك كل إبهام بحركة دائرية داخل الكف الآخر.",
      "Press and rub fingertips and nails into the palm of the opposite hand, then rub each wrist.||افرك أطراف الأصابع والأظافر داخل راحة اليد الأخرى، ثم افرك كل معصم.",
      "Rinse hands under water keeping fingers pointing upward.||اشطف يديك تحت الماء مع توجيه الأصابع للأعلى.",
      "Pat hands dry with a clean paper towel, then use it to turn off the faucet.||جفّف يديك بمنشفة ورقية نظيفة، ثم استخدمها لإغلاق الصنبور."
    ]
  },
  {
    id: 'blood-pressure',
    title: 'قياس ضغط الدم (Blood Pressure Measurement)',
    category: 'العلامات الحيوية',
    videoUrl: 'https://youtu.be/HMSTSZVWhMI?si=B5NprHJlvhd6ck_2',
    description: 'قائمة تدقيق رسمية معتمدة لقياس ضغط الدم بطريقة الاستماع (Auscultation).',
    steps: [
      "Gather equipment, perform hand hygiene, identify the patient, and explain the procedure.||جهّز الأدوات، اغسل يديك، تحقق من هوية المريض، واشرح الإجراء.",
      "Assist the patient to a comfortable position and expose the upper arm completely.||ساعد المريض على وضعية مريحة واكشف الذراع العلوي بالكامل.",
      "Wrap the deflated cuff snugly around the upper arm with the bladder centered over the brachial artery, about 2 cm above the antecubital space.||لف الكفة المفرغة بإحكام حول الذراع مع توسيط الكيس فوق الشريان العضدي، على بعد 2 سم فوق ثنية المرفق.",
      "Palpate the brachial artery, close the valve, and inflate the cuff until the pulse disappears; note this reading.||جس الشريان العضدي، أغلق الصمام، وانفخ الكفة حتى يختفي النبض، ودوّن هذه القراءة.",
      "Slowly deflate the cuff fully and wait 30 seconds before reinflating.||أفرغ الكفة ببطء بالكامل وانتظر 30 ثانية قبل إعادة النفخ.",
      "Clean the stethoscope earpieces and diaphragm with alcohol and place it over the brachial artery.||نظّف سماعة الطبيب بالكحول وضعها فوق الشريان العضدي.",
      "Inflate the cuff 20 mmHg above the point the radial pulse disappeared.||انفخ الكفة 20 ملم زئبق أعلى من نقطة اختفاء النبض الكعبري.",
      "Slowly release the valve; note the pressure at the first clear Korotkoff sound (systolic) and when sounds disappear (diastolic).||حرر الصمام ببطء؛ دوّن الضغط عند أول صوت كوروتكوف واضح (الانقباضي) وعند اختفاء الأصوات (الانبساطي).",
      "Remove the cuff and earpieces, wash hands, and record and report any abnormal finding.||أزل الكفة والسماعة، اغسل يديك، وسجّل وأبلغ عن أي نتيجة غير طبيعية."
    ]
  },
  {
    id: 'temperature-measurement',
    title: 'قياس درجة الحرارة (Temperature Measurement)',
    category: 'العلامات الحيوية',
    // 🎥 ضع هنا رابط فيديو شرح "قياس درجة الحرارة" (رابط embed مثل: https://www.youtube-nocookie.com/embed/VIDEO_ID)
    videoUrl: 'https://youtu.be/nvl1qQfgzuw?si=V_Zdk-vLwfzPgukO',
    description: 'قائمة تدقيق رسمية معتمدة لقياس درجة الحرارة عن طريق الفم والإبط مع الترجمة العربية لكل خطوة.',
    steps: [
      "Identify the patient verbally using two identifiers and check their readiness for the procedure.||تحقق من هوية المريض بمعرّفين اثنين وتأكد من استعداده لإجراء العملية.",
      "Gather the equipment correctly and maintain the patient's privacy throughout the procedure.||جهّز الأدوات بشكل صحيح وحافظ على خصوصية المريض طوال الإجراء.",
      "Follow correct body mechanics (ABC principles) and use accepted communication skills.||اتبع الميكانيكا الجسدية الصحيحة (مبادئ ABC) واستخدم مهارات تواصل مقبولة مع المريض.",
      "Wash hands and wear gloves.||اغسل يديك وارتدِ القفازات.",
      "Oral method: Clean the thermometer from bulb to stem and shake it down below 35°.||الطريقة الفموية: نظّف الترمومتر من الرأس للجسم وهزّه حتى ينزل المؤشر تحت 35 درجة.",
      "Place the thermometer in the left or right posterior sublingual pocket.||ضع الترمومتر في الجيب الخلفي تحت اللسان يميناً أو يساراً.",
      "Ask the patient to close the lips around it, not the teeth.||اطلب من المريض إغلاق شفتيه حول الترمومتر وليس أسنانه.",
      "Leave the thermometer for 3 minutes, then wipe it from stem to bulb.||اترك الترمومتر لمدة 3 دقائق، ثم امسحه من الجسم للرأس.",
      "Axillary method: Inspect the axilla for skin lesions, then place the thermometer in the center of the axilla.||الطريقة الإبطية: افحص الإبط للتأكد من خلوه من أي آفات جلدية، ثم ضع الترمومتر في مركز الإبط.",
      "Keep the arm pressed tightly against the side of the chest and leave the thermometer in place for 5 minutes.||اضغط الذراع بإحكام على جانب الصدر واترك الترمومتر في مكانه لمدة 5 دقائق.",
      "Remove the thermometer and clean it with an alcohol swab.||أزل الترمومتر ونظّفه بمسحة كحول.",
      "Wipe the thermometer from stem to bulb and read it correctly at eye level.||امسح الترمومتر من الجسم للرأس واقرأ القياس بشكل صحيح على مستوى العين.",
      "Remove gloves, wash hands, and dispose of waste correctly in the appropriate bin.||انزع القفازات، اغسل يديك، وتخلص من النفايات في الحاوية المخصصة.",
      "Record and report any abnormal finding.||سجّل وأبلغ عن أي نتيجة غير طبيعية."
    ]
  },
  {
    id: 'pulse-measurement',
    title: 'قياس النبض (Pulse Measurement)',
    category: 'العلامات الحيوية',
    // 🎥 ضع هنا رابط فيديو شرح "قياس النبض" (رابط embed مثل: https://www.youtube-nocookie.com/embed/VIDEO_ID)
    videoUrl: 'https://youtube.com/shorts/gbatmc__N8g?si=zlMV1y07BHPL8Edb',
    description: 'قائمة تدقيق رسمية معتمدة لقياس النبض الكعبري (الرسغي) والقمي مع الترجمة العربية لكل خطوة.',
    steps: [
      "Identify the patient verbally using two identifiers and check their readiness for the procedure.||تحقق من هوية المريض بمعرّفين اثنين وتأكد من استعداده لإجراء العملية.",
      "Gather the equipment correctly and maintain the patient's privacy throughout the procedure.||جهّز الأدوات بشكل صحيح وحافظ على خصوصية المريض طوال الإجراء.",
      "Wash hands and wear gloves.||اغسل يديك وارتدِ القفازات.",
      "Radial pulse: Assist the patient to a comfortable position and wear a watch with a second hand.||النبض الكعبري: ساعد المريض على اتخاذ وضعية مريحة وارتدِ ساعة بها عقرب ثوانٍ.",
      "Place the patient's arm alongside the body or across the chest.||ضع ذراع المريض بجانب جسمه أو عبر صدره.",
      "Place the first 2-3 middle fingertips lightly over the pulse point and palpate the pulse.||ضع أطراف الأصابع الوسطى (2-3 أصابع) برفق فوق موضع النبض وجسّه.",
      "Count for a full minute, noting the rate, rhythm, and volume.||عدّ النبض لمدة دقيقة كاملة، مع ملاحظة المعدل والانتظام والقوة.",
      "Apical pulse: Clean and warm the stethoscope.||النبض القمي: نظّف السماعة الطبية ودفّئها.",
      "Place the stethoscope over the 5th intercostal space (midclavicular line).||ضع السماعة على المسافة الوربية الخامسة (منتصف الترقوة).",
      "Auscultate the heartbeats and count for a full minute.||أصغِ لدقات القلب وعدّها لمدة دقيقة كاملة.",
      "Remove gloves, wash hands, and dispose of waste correctly in the appropriate bin.||انزع القفازات، اغسل يديك، وتخلص من النفايات في الحاوية المخصصة.",
      "Record and report any abnormal finding.||سجّل وأبلغ عن أي نتيجة غير طبيعية."
    ]
  },
  {
    id: 'sterile-gowning-gloving',
    title: 'ارتداء الرداء والقفازات المعقمة (Sterile Gowning & Gloving)',
    category: 'التعقيم الجراحي',
    videoUrl: 'https://youtu.be/lumZOF-METc?si=SyS4jPLIoWok6K7s',
    description: 'قائمة تدقيق رسمية معتمدة لارتداء وخلع الرداء والقفازات المعقمة بطريقة Open Method.',
    steps: [
      "Wear a head covering and mask, then perform a surgical hand scrub.||ارتدِ غطاء الرأس والكمامة، ثم قم بالغسيل الجراحي لليدين.",
      "Pick up the gown at the neckline with both hands, lift it upward, and step back away from the table.||أمسك الرداء من عند الرقبة بكلتا اليدين، ارفعه للأعلى، وابتعد للخلف عن الطاولة.",
      "Allow the gown to unfold without touching anything, then insert both arms into the sleeves.||دع الرداء يفرد نفسه دون لمس أي شيء، ثم أدخل ذراعيك في الكمين.",
      "Ask the circulating nurse to bring the gown over your shoulders and tie it at the neck and waist.||اطلب من الممرضة المساعدة تثبيت الرداء على كتفيك وربطه عند الرقبة والخصر.",
      "Pick up the right glove with your left hand, touching only the inside of the cuff.||أمسك القفاز الأيمن بيدك اليسرى، مع لمس الجزء الداخلي من الكفة فقط.",
      "Slide your right-hand fingers into the glove, leaving the thumb out, then pull the cuff up and over.||أدخل أصابع يدك اليمنى في القفاز مع ترك الإبهام خارجاً، ثم اسحب الكفة للأعلى.",
      "Pick up the second glove by sliding your gloved fingers underneath its cuff.||أمسك القفاز الثاني بتمرير أصابعك المقفزة أسفل كفته.",
      "In one movement, pull the second glove over your hand and the cuff of the gown.||بحركة واحدة، اسحب القفاز الثاني فوق يدك وكفة الرداء.",
      "To remove: ask the circulating nurse to unfasten the neck ties first.||لخلع الرداء: اطلب من الممرضة المساعدة فك ربطة الرقبة أولاً.",
      "Grasp the gown away from the neck and shoulders, turn it inside out, roll it into a bundle, and discard it.||أمسك الرداء بعيداً عن الرقبة والكتفين، اقلبه من الداخل، لفّه، وتخلص منه.",
      "Remove the gloves by grasping the cuff of one and pulling it inside out over the hand.||انزع القفاز الأول بمسك كفته وسحبه للخارج فوق اليد.",
      "Slide ungloved fingers under the remaining glove's wrist and peel it off over the first glove, then discard both.||أدخل أصابعك العارية أسفل كفة القفاز المتبقي وانزعه فوق القفاز الأول، ثم تخلص منهما."
    ]
  },
  {
    id: 'hand-scrubbing',
    title: 'الغسيل الجراحي لليدين (Surgical Hand Scrubbing)',
    category: 'التعقيم الجراحي',
    videoUrl: 'https://youtu.be/--N2d5Yp6HE?si=p1a8iE6Fj0A56b_G',
    description: 'قائمة تدقيق رسمية معتمدة للغسيل الجراحي لليدين قبل العمليات.',
    steps: [
      "Inspect hands and arms for intact skin and natural nails; remove rings, nail polish, and watch.||افحص اليدين والذراعين للتأكد من سلامة الجلد وطبيعية الأظافر؛ أزل الخواتم وطلاء الأظافر والساعة.",
      "Apply a face mask and cap, then turn on water and adjust the temperature.||ارتدِ الكمامة وغطاء الرأس، ثم افتح الماء واضبط درجة حرارته.",
      "Wet hands and forearms from elbows to fingertips, then clean under the nails with a nail pick under running water.||بلل اليدين والساعدين من المرفقين حتى أطراف الأصابع، ونظّف تحت الأظافر بعود تحت الماء الجاري.",
      "Apply antiseptic to a scrub sponge and scrub the nails for 10 strokes.||ضع المطهر على إسفنجة التنظيف وافرك الأظافر 10 حركات.",
      "Reapply antiseptic and scrub the palm, all sides of each finger and thumb, and the back of the hand.||أعد وضع المطهر وافرك راحة اليد وجميع جوانب كل إصبع والإبهام وظهر اليد.",
      "Divide the forearm into 3 sections and scrub each with at least 10 circular strokes, moving from distal to proximal.||قسّم الساعد لثلاثة أقسام وافرك كل قسم بحركة دائرية 10 مرات على الأقل من الأسفل للأعلى.",
      "Repeat the entire scrub sequence on the other hand and arm.||كرر تسلسل الفرك بالكامل على اليد والذراع الأخرى.",
      "Rinse hands and arms while holding both hands above elbow level.||اشطف اليدين والذراعين مع إبقائهما أعلى مستوى المرفقين.",
      "Dry each hand and arm separately using one half of the sterile towel each.||جفّف كل يد وذراع بشكل منفصل باستخدام نصف المنشفة المعقمة لكل منهما.",
      "Discard the towel into a linen hamper while keeping hands above elbow level.||تخلص من المنشفة في سلة الغسيل مع إبقاء اليدين أعلى مستوى المرفقين."
    ]
  },
  {
    id: 'id-injection',
    title: 'الحقن داخل الأدمة (Intradermal Injection)',
    category: 'إعطاء الأدوية والحقن',
    videoUrl: 'https://youtu.be/f3w-MlDAdg0?si=nCcTU0lnGPXOhus2',
    description: 'قائمة تدقيق رسمية معتمدة لإعطاء الحقنة داخل الأدمة (اختبارات الحساسية).',
    steps: [
      "Check for allergies, wash hands, wear gloves, and follow the ten rights of medication.||تحقق من الحساسية، اغسل يديك، ارتدِ القفازات، واتبع الحقوق العشرة للدواء.",
      "Prepare the medication from the ampule/vial and double-check the amount in the syringe.||جهّز الدواء من الأمبولة/الفيال وتأكد من الكمية بالسرنجة مرتين.",
      "Explain the procedure, check the ID band, position the patient, and provide privacy.||اشرح الإجراء، تحقق من سوار الهوية، ضع المريض بالوضعية المناسبة، ووفّر الخصوصية.",
      "Assess the skin for bruises or redness, cleanse with alcohol from inside outward, and let it dry 30 seconds.||افحص الجلد بحثاً عن كدمات أو احمرار، نظّف بالكحول من الداخل للخارج، واتركه يجف 30 ثانية.",
      "Grasp the forearm and pull the skin taut; place the needle bevel-up close to the skin.||أمسك الساعد وشد الجلد؛ ضع الإبرة قريبة من الجلد مع اتجاه الشطبة للأعلى.",
      "Insert the needle at a 10-15° angle until the tip is visible just beneath the skin (about 3 mm).||أدخل الإبرة بزاوية 10-15° حتى يظهر طرفها تحت الجلد مباشرة (حوالي 3 مم).",
      "Inject the medication slowly and observe for a bleb (raised area); do not massage the site afterward.||احقن الدواء ببطء ولاحظ ظهور انتفاخ صغير (Bleb)؛ لا تدلك المكان بعد الحقن.",
      "Discard the needle in a sharps container, remove gloves, and wash hands.||تخلص من الإبرة في حاوية الأدوات الحادة، انزع القفازات، واغسل يديك.",
      "Observe for allergic reaction, circle the bleb perimeter with a pen, and document on the MAR.||راقب أي رد فعل تحسسي، ارسم دائرة حول الانتفاخ بقلم، ووثّق في سجل الأدوية."
    ]
  },
  {
    id: 'sc-injection',
    title: 'الحقن تحت الجلد (Subcutaneous Injection)',
    category: 'إعطاء الأدوية والحقن',
    videoUrl: 'https://youtu.be/xIutkc2Yxig?si=NgkqDRgKV1m_PEjo',
    description: 'قائمة تدقيق رسمية معتمدة لإعطاء الحقنة تحت الجلد (مثل الإنسولين ومضادات التخثر).',
    steps: [
      "Check for allergies, wash hands, wear gloves, and follow the ten rights of medication.||تحقق من الحساسية، اغسل يديك، ارتدِ القفازات، واتبع الحقوق العشرة للدواء.",
      "Prepare the medication and double-check the amount in the syringe.||جهّز الدواء وتأكد من الكمية بالسرنجة مرتين.",
      "Explain the procedure, check the ID band, position the patient, and provide privacy.||اشرح الإجراء، تحقق من سوار الهوية، ضع المريض بالوضعية المناسبة، ووفّر الخصوصية.",
      "Assess the site, cleanse with an alcohol wipe in a firm circular motion, and let it dry.||قيّم المكان، نظّفه بمسحة كحول بحركة دائرية ثابتة، واتركه يجف.",
      "Hold the syringe like a dart, pinch the subcutaneous tissue with the other hand, and insert the needle quickly at a 90° angle.||أمسك السرنجة كالسهم، اقرص الأنسجة تحت الجلد باليد الأخرى، وأدخل الإبرة بسرعة بزاوية 90°.",
      "Release the tissue and aspirate gently (except with anticoagulants); if blood appears, discard and restart.||حرر الأنسجة واسحب المكبس برفق (إلا مع مضادات التخثر)؛ فإن ظهر دم، تخلص من الجرعة وابدأ من جديد.",
      "Inject the medication slowly, then withdraw the needle quickly and apply gentle pressure with gauze.||احقن الدواء ببطء، ثم اسحب الإبرة بسرعة واضغط برفق بالشاش.",
      "Do not recap the needle; discard it directly in a sharps container.||لا تعد تغطية الإبرة؛ تخلص منها مباشرة في حاوية الأدوات الحادة.",
      "Position the patient comfortably, remove gloves, and wash hands.||ضع المريض بوضعية مريحة، انزع القفازات، واغسل يديك.",
      "Record the dosage, route, site, and time; observe for side effects and medication effectiveness.||سجّل الجرعة والطريق والمكان والوقت؛ راقب أي آثار جانبية ومدى فعالية الدواء."
    ]
  }
];

export const STATIC_TERMS: StaticTerm[] = [
  {
    keywords: 'paracetamol panadol باراسيتامول بانادول مسكن خافض حرارة أدوية صداع سخونية وجع',
    nameAr: 'باراسيتامول / بانادول (Paracetamol)',
    nameEn: 'Paracetamol / Acetaminophen',
    category: 'الأدوية والعلاجيات',
    definition: 'مسكن شهير للآلام ومضاد وخافض للحرارة (لعلاج السخونية والصداع). يُعطى فموياً (PO) أو وريدياً (IV). الجرعة القصوى للبالغين 4 جرام يومياً.',
    nursingCare: 'مراقبة وظائف الكبد عند الجرعات العالية وتجنب مضاعفة الدواء مع أدول أو بانادول مركب.'
  },
  {
    keywords: 'insulin انسولين سكر سكري تحت الجلد subq أدوية حقن سكر عالي',
    nameAr: 'الأنسولين (Insulin)',
    nameEn: 'Insulin Therapy',
    category: 'أدوية الهرمونات والغدد',
    definition: 'هرمون أساسي لخفض سكر الدم المرتفع بالحالات السكرية. يُعطى حقناً تحت الجلد (SubQ) أو وريدياً بالحالات الحرجة بالحموضة السكرية (DKA).',
    nursingCare: 'التأكد من قياس سكر الدم قبل الحقن مباشرة وتوفير وجبة طعام لتجنب الهبوط الحاد (Hypoglycemia).'
  },
  {
    keywords: 'aspirin اسبرين سيولة مسكن أدوية جلطة قلب',
    nameAr: 'الأسبيرين (Aspirin)',
    nameEn: 'Acetylsalicylic Acid (ASA)',
    category: 'أدوية أوعية الدم والقلب',
    definition: 'مضاد لتجمع الصفائح الدموية ومضاد للجلطات وحماية لشرايين القلب والذبحات الصدرية.',
    nursingCare: 'مراقبة علامات النزيف المعوي أو اللثة وأخذه بعد الطعام لتجنب قرحة المعدة.'
  },
  {
    keywords: 'nitroglycerin نتروجليسرين تحت اللسان sl ذبحة صدرية أدوية وجع قلب أزمة',
    nameAr: 'النتروجليسرين (Nitroglycerin)',
    nameEn: 'Nitroglycerin Sublingual / Infusion',
    category: 'أدوية القلب والطوارئ',
    definition: 'موسع للأوعية الدموية والشرايين التاجية يُعطى تحت اللسان (SL) لعلاج آلام الذبحة الصدرية والأزمات القلبية.',
    nursingCare: 'قياس ضغط الدم قبل إعطاء الجرعة وتكرار القرص كل 5 دقائق لمجموع 3 أقراص بالذبحة إذا استمر الضغط فوق 90.'
  },
  {
    keywords: 'adrenaline epinephrine ابينفرين أدرينالين طوارئ صدمة حساسية أدوية إنعاش تورم',
    nameAr: 'الأدرينالين / الأبينفرين (Adrenaline / Epinephrine)',
    nameEn: 'Epinephrine (Adrenaline)',
    category: 'أدوية إنعاش الطوارئ (Code Blue)',
    definition: 'دواء حاسم لمنع الصدمة التحسسية الحادة وتنشيط القلب أثناء توقف النبض والإنعاش القلبي.',
    nursingCare: 'إعطاؤه بالعضل بالفخذ في الحساسية الحادة، وإعطاؤه وريدياً كل 3-5 دقائق أثناء توقف القلب (CPR).'
  },
  {
    keywords: 'ecg ekg تخطيط القلب قلب علامات حيوية رسم رسمة ضربات',
    nameAr: 'تخطيط رسم القلب (ECG / EKG)',
    nameEn: 'Electrocardiogram (ECG)',
    category: 'الفحوصات الإكلينيكية',
    definition: 'تسجيل النشاط الكهربائي العضلي للقلب للكشف عن اضطرابات النظم والنوبات التاجية واحتشاء عضلة القلب.',
    nursingCare: 'تثبيت الأقطاب الـ 12 بدقة على الصدر والأطراف وتنبيه المريض للهدوء والاسترخاء أثناء التسجيل.'
  },
  {
    keywords: 'bp ضغط الدم علامات حيوية واطي عالي هبوط قياس',
    nameAr: 'ضغط الدم الشرياني (BP - Blood Pressure)',
    nameEn: 'Arterial Blood Pressure',
    category: 'العلامات الحيوية',
    definition: 'مقياس القوة التي يمارسها الدم على جدران الشرايين (المعدل الطبيعي بالبالغين حوالي 120/80 مم زئبق).',
    nursingCare: 'اختيار مقاس الكفة المناسب لمحيط الذراع وإراحة المريض 5 دقائق قبل القياس.'
  },
  {
    keywords: 'spo2 تشبع الأكسجين علامات حيوية تنفس اختناق كتمة',
    nameAr: 'تشبع الدم بالأكسجين (SpO2)',
    nameEn: 'Pulse Oximetry Oxygen Saturation',
    category: 'العلامات الحيوية',
    definition: 'نسبة الهيموجلوبين المشبع بالأكسجين بالدم المحيطي (الطبيعي بين 95% و100%).',
    nursingCare: 'تأكد من إزالة طلاء الأظافر ودفء الأطراف ووضع الحساس على إصبع دافئ ونظيف.'
  },
  {
    keywords: 'abg غازات الدم تحاليل حرجة تنفس حموضة أكسجين',
    nameAr: 'غازات الدم الشرياني (ABG)',
    nameEn: 'Arterial Blood Gas Analysis',
    category: 'التحاليل الحيوية الحرجة',
    definition: 'تحليل شرياني يقيس مستوى حموضة الدم (pH)، ثاني أكسيد الكربون (PaCO2)، والأكسجين (PaO2) لتقييم التنفس والميزان الحمضي.',
    nursingCare: 'إجراء فحص ألين (Allen’s Test) قبل الوكز الشرياني، والضغط على الشريان 5 دقائق متواصلة بعد سحب العينة.'
  },
  {
    keywords: 'cbc صورة دم كاملة تحاليل مخبرية انيميا صديد هيموجلوبين',
    nameAr: 'صورة الدم الكاملة (CBC)',
    nameEn: 'Complete Blood Count',
    category: 'التحاليل المخبرية',
    definition: 'تحليل دم مخبري شامل لقياس كريات الدم البيضاء والحمراء والهيموجلوبين والصفائح الدموية.',
    nursingCare: 'سحب العينة بأنبوب EDTA البنفسجي ورجه بلطف لمنع التجلط.'
  }
];
