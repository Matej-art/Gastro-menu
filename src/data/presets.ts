import { MenuAnalysisResult } from '../types/menu';

export interface SampleMenuPreset {
  id: string;
  title: string;
  badge: string;
  description: string;
  rawText: string;
  sampleResult: MenuAnalysisResult;
}

export const SAMPLE_PRESETS: SampleMenuPreset[] = [
  {
    id: 'ceska-hospoda',
    title: 'Hospoda „U Zlatého lva“',
    badge: 'Tradiční česká kuchyně',
    description: 'Poctivá česnečka, svíčková na smetaně, vepřové výpečky a jablečný štrúdl.',
    rawText: `POLEDNÍ MENU - STŘEDA 24. 9.
(Polévka k menu za 35 Kč, samostatně 55 Kč)

POLÉVKY:
- Poctivá česnečka s opečeným chlebem, sýrem a uzeným masem (A: 1, 7) - 55 Kč
- Silný hovězí vývar s játrovými knedlíčky a nudlemi (A: 1, 3, 9) - 50 Kč

HLAVNÍ JÍDLA:
1. 150g Hovězí svíčková na smetaně, houskový knedlík, brusinkový terč se šlehačkou (A: 1, 3, 7, 9, 10) - 185 Kč
2. 180g Pečené vepřové výpečky, dušené kysané červené zelí, variace knedlíků (A: 1, 3) - 165 Kč
3. 200g Smažený sýr gouda, vařené pažitkové brambory, domácí tatarská omáčka (A: 1, 3, 7, 10) - 159 Kč
4. 300g Krémové hříbkové risotto s parmazánem a lístky polníčku (Vegetariánské) (A: 7) - 155 Kč

DEZERT:
- Teplý domácí jablečný závin s vanilkovou zmrzlinou a vlašskými ořechy (A: 1, 3, 7, 8) - 75 Kč`,
    sampleResult: {
      restaurantName: 'Hospoda U Zlatého lva',
      menuDate: 'Polední menu – Středa 24. září',
      servingHours: '11:00 – 14:30 (nebo do vyprodání)',
      dishes: [
        {
          category: 'Polévky',
          name: 'Poctivá česnečka s opečeným chlebem, sýrem a uzeným',
          description: 'Hustá česnečka s vůní majoránky, křupavými krutony a tažným sýrem',
          price: '55 Kč',
          allergens: [1, 7],
        },
        {
          category: 'Polévky',
          name: 'Silný hovězí vývar s játrovými knedlíčky a nudlemi',
          description: 'Dvanáct hodin tažený hovězí morkový vývar se zeleninou julienne',
          price: '50 Kč',
          allergens: [1, 3, 9],
        },
        {
          category: 'Hlavní jídla',
          name: '150g Hovězí svíčková na smetaně s houskovým knedlíkem',
          description: 'Křehké špikované hovězí, sametová kořenová omáčka zjemněná smetanou, brusinkový terč',
          price: '185 Kč',
          allergens: [1, 3, 7, 9, 10],
        },
        {
          category: 'Hlavní jídla',
          name: '180g Pečené vepřové výpečky, červené zelí, variace knedlíků',
          description: 'Do křupava pečený bůček a plec, karamelizované kysané zelí, bramborový a houskový knedlík',
          price: '165 Kč',
          allergens: [1, 3],
        },
        {
          category: 'Hlavní jídla',
          name: '200g Smažený sýr gouda, pažitkové brambory, domácí tatarka',
          description: 'Zlatavý sýr v křupavém trojobalu, máslové brambory s pažitkou a poctivá tatarská omáčka',
          price: '159 Kč',
          allergens: [1, 3, 7, 10],
        },
        {
          category: 'Hlavní jídla',
          name: '300g Krémové hříbkové risotto s parmazánem',
          description: 'Italská rýže Carnaroli s lesními hříbky, bílým vínem a hoblinami Grana Padano',
          price: '155 Kč',
          allergens: [7, 12],
        },
        {
          category: 'Dezerty a doplňky',
          name: 'Teplý domácí jablečný závin se zmrzlinou',
          description: 'Voňavý štrúdl se skořicí a rozinkami, kopeček vanilkové zmrzliny a vlašské ořechy',
          price: '75 Kč',
          allergens: [1, 3, 7, 8],
        },
      ],
      socialPosts: {
        facebook: {
          headline: '✨ Dnes v poledne voní U Zlatého lva poctivá česká klasika! 🍲🥩',
          body: `Už vám kručí v břiše? Přerušte práci a dopřejte si pořádný oběd z čerstvých surovin. Dnes pro vás náš šéfkuchař připravil:

🍲 Polévky:
• Silný hovězí vývar s játrovými knedlíčky a domácími nudlemi
• Poctivá vyprošťovací česnečka s voňavým uzeným a sýrem

🥩 Hlavní chody:
1️⃣ Naše vyhlášená Hovězí svíčková na smetaně, tažená na kořenové zelenině, s nadýchaným houskovým knedlíkem a brusinkami (185 Kč)
2️⃣ Šťavnaté vepřové výpečky na kmíně s karamelizovaným červeným zelím a variací knedlíků (165 Kč)
3️⃣ Zlatavý smažený sýr gouda s máslovými pažitkovými bramborami a poctivou domácí tatarkou (159 Kč)
4️⃣ Krémové hříbkové risotto s lesními houbami a parmazánem (155 Kč)

🍰 Sladká tečka:
• Teplý tažený jablečný závin s vanilkovou zmrzlinou (75 Kč)`,
          callToAction: '⏰ Obědy servírujeme od 11:00 do 14:30. Stůl si rezervujte na čísle nebo se rovnou zastavte, jídlo vám rádi zabalíme i s sebou!',
          hashtags: ['#polednimenu', '#kamnaobed', '#svickova', '#hospodauZlateholva', '#dnesjim', '#ceskakuchyne', '#poledninabidka', '#gastromapa'],
          fullFormattedText: `✨ Dnes v poledne voní U Zlatého lva poctivá česká klasika! 🍲🥩

Už vám kručí v břiše? Přerušte práci a dopřejte si pořádný oběd z čerstvých surovin. Dnes pro vás náš šéfkuchař připravil:

🍲 Polévky:
• Silný hovězí vývar s játrovými knedlíčky a nudlemi
• Poctivá česnečka s voňavým uzeným, sýrem a krutony

🥩 Hlavní chody:
1️⃣ Naše vyhlášená Hovězí svíčková na smetaně, tažená na kořenové zelenině, s nadýchaným knedlíkem a brusinkami (185 Kč)
2️⃣ Šťavnaté vepřové výpečky na kmíně s dušeným červeným zelím a variací knedlíků (165 Kč)
3️⃣ Zlatavý smažený sýr gouda s máslovými pažitkovými bramborami a poctivou domácí tatarkou (159 Kč)
4️⃣ Krémové hříbkové risotto s lesními houbami a parmazánem (155 Kč)

🍰 Sladká tečka:
• Teplý tažený jablečný závin s vanilkovou zmrzlinou (75 Kč)

⏰ Obědy servírujeme od 11:00 do 14:30.
📞 Rezervace stolů & jídlo s sebou na telefonu podniku. Těšíme se na vás!

#polednimenu #kamnaobed #svickova #dnesjim #ceskakuchyne #poledninabidka #gastromapa #poctivyobed`,
        },
        instagram: {
          hook: 'Křehká svíčková nebo křupavé výpečky? Dnešní polední dilema vyřešeno! 🤤👇',
          caption: `Když venku práce nepočká, poctivý teplý oběd tě zachrání. Dnes U Zlatého lva servírujeme tažený dvanáctihodinový hovězí vývar a hlavně naši ikonickou svíčkovou na smetaně se šlehačkou a brusinkami. 

Pro milovníky klasiky máme dozlatova pečené vepřové výpečky se zelím a pro bezmasé dny krémové hříbkové risotto. 🧀

Kdo stihne teplý štrúdl s vanilkovou zmrzlinou?

📍 Kde: Hospoda U Zlatého lva
⏱️ Kdy: 11:00 – 14:30
📦 Takeaway krabičky k dispozici`,
          hashtags: ['#polednimenu', '#dnesjim', '#svickovanaobede', '#kamnaobed', '#obedvpraze', '#ceskejidlo', '#foodiecz', '#gastronomieczech', '#obedovapauza'],
          fullFormattedText: `Křehká svíčková nebo křupavé výpečky? Dnešní polední dilema vyřešeno! 🤤👇

Když venku práce nepočká, poctivý teplý oběd tě zachrání. Dnes U Zlatého lva servírujeme tažený dvanáctihodinový hovězí vývar a hlavně naši ikonickou svíčkovou na smetaně se šlehačkou a brusinkami. 

Pro milovníky klasiky máme dozlatova pečené vepřové výpečky se zelím a pro bezmasé dny krémové hříbkové risotto. 🧀

Kdo stihne teplý štrúdl s vanilkovou zmrzlinou?

📍 Kde: Hospoda U Zlatého lva
⏱️ Kdy: 11:00 – 14:30
📦 Takeaway krabičky k dispozici

.
.
.
#polednimenu #dnesjim #svickovanaobede #kamnaobed #ceskejidlo #foodiecz #gastronomieczech #obedovapauza #poledninabidka`,
        },
        smsWhatsapp: 'Dnes U Zlatého lva: Svíčková na smetaně (185 Kč), Vepřové výpečky se zelím (165 Kč), Smažák s tatarkou (159 Kč) + silný hovězí vývar. Výdej od 11h. Rezervace na baru!',
      },
      htmlTable: {
        styledSnippet: `<div class="gastro-menu-container" style="max-width: 780px; margin: 20px auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #eaeaea;">
  <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff; padding: 24px 28px; text-align: center;">
    <h3 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">Polední menu – Středa 24. září</h3>
    <p style="margin: 0; font-size: 14px; opacity: 0.85;">Podáváme od 11:00 do 14:30 nebo do vyprodání</p>
  </div>
  <table style="width: 100%; border-collapse: collapse; text-align: left;">
    <thead>
      <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
        <th style="padding: 12px 20px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">Položka menu</th>
        <th style="padding: 12px 16px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; text-align: center; width: 100px;">Alergeny</th>
        <th style="padding: 12px 20px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; text-align: right; width: 110px;">Cena</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background-color: #fffbeb;"><td colspan="3" style="padding: 10px 20px; font-weight: 700; font-size: 14px; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px;">🥣 Polévky</td></tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 14px 20px;">
          <strong style="color: #0f172a; font-size: 15px;">Poctivá česnečka s opečeným chlebem, sýrem a uzeným</strong>
          <div style="color: #64748b; font-size: 13px; margin-top: 2px;">Hustá česnečka s vůní majoránky, křupavými krutony a tažným sýrem</div>
        </td>
        <td style="padding: 14px 16px; text-align: center;">
          <span style="display: inline-block; background: #e2e8f0; color: #334155; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">1, 7</span>
        </td>
        <td style="padding: 14px 20px; text-align: right; font-weight: 700; color: #0f172a; font-size: 15px;">55 Kč</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 14px 20px;">
          <strong style="color: #0f172a; font-size: 15px;">Silný hovězí vývar s játrovými knedlíčky a nudlemi</strong>
          <div style="color: #64748b; font-size: 13px; margin-top: 2px;">Dvanáct hodin tažený hovězí morkový vývar se zeleninou julienne</div>
        </td>
        <td style="padding: 14px 16px; text-align: center;">
          <span style="display: inline-block; background: #e2e8f0; color: #334155; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">1, 3, 9</span>
        </td>
        <td style="padding: 14px 20px; text-align: right; font-weight: 700; color: #0f172a; font-size: 15px;">50 Kč</td>
      </tr>
      <tr style="background-color: #fffbeb;"><td colspan="3" style="padding: 10px 20px; font-weight: 700; font-size: 14px; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px;">🥩 Hlavní jídla</td></tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 14px 20px;">
          <strong style="color: #0f172a; font-size: 15px;">150g Hovězí svíčková na smetaně s houskovým knedlíkem</strong>
          <div style="color: #64748b; font-size: 13px; margin-top: 2px;">Křehké špikované hovězí, sametová kořenová omáčka zjemněná smetanou, brusinkový terč</div>
        </td>
        <td style="padding: 14px 16px; text-align: center;">
          <span style="display: inline-block; background: #e2e8f0; color: #334155; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">1, 3, 7, 9, 10</span>
        </td>
        <td style="padding: 14px 20px; text-align: right; font-weight: 700; color: #0f172a; font-size: 15px;">185 Kč</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 14px 20px;">
          <strong style="color: #0f172a; font-size: 15px;">180g Pečené vepřové výpečky, červené zelí, variace knedlíků</strong>
          <div style="color: #64748b; font-size: 13px; margin-top: 2px;">Do křupava pečený bůček a plec, karamelizované kysané zelí, bramborový a houskový knedlík</div>
        </td>
        <td style="padding: 14px 16px; text-align: center;">
          <span style="display: inline-block; background: #e2e8f0; color: #334155; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">1, 3</span>
        </td>
        <td style="padding: 14px 20px; text-align: right; font-weight: 700; color: #0f172a; font-size: 15px;">165 Kč</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 14px 20px;">
          <strong style="color: #0f172a; font-size: 15px;">200g Smažený sýr gouda, pažitkové brambory, domácí tatarka</strong>
          <div style="color: #64748b; font-size: 13px; margin-top: 2px;">Zlatavý sýr v křupavém trojobalu, máslové brambory s pažitkou a poctivá tatarská omáčka</div>
        </td>
        <td style="padding: 14px 16px; text-align: center;">
          <span style="display: inline-block; background: #e2e8f0; color: #334155; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">1, 3, 7, 10</span>
        </td>
        <td style="padding: 14px 20px; text-align: right; font-weight: 700; color: #0f172a; font-size: 15px;">159 Kč</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 14px 20px;">
          <strong style="color: #0f172a; font-size: 15px;">300g Krémové hříbkové risotto s parmazánem</strong>
          <div style="color: #64748b; font-size: 13px; margin-top: 2px;">Italská rýže Carnaroli s lesními hříbky, bílým vínem a hoblinami Grana Padano</div>
        </td>
        <td style="padding: 14px 16px; text-align: center;">
          <span style="display: inline-block; background: #e2e8f0; color: #334155; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">7, 12</span>
        </td>
        <td style="padding: 14px 20px; text-align: right; font-weight: 700; color: #0f172a; font-size: 15px;">155 Kč</td>
      </tr>
      <tr style="background-color: #fffbeb;"><td colspan="3" style="padding: 10px 20px; font-weight: 700; font-size: 14px; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px;">🍰 Dezerty</td></tr>
      <tr>
        <td style="padding: 14px 20px;">
          <strong style="color: #0f172a; font-size: 15px;">Teplý domácí jablečný závin se zmrzlinou</strong>
          <div style="color: #64748b; font-size: 13px; margin-top: 2px;">Voňavý štrúdl se skořicí a rozinkami, kopeček vanilkové zmrzliny a vlašské ořechy</div>
        </td>
        <td style="padding: 14px 16px; text-align: center;">
          <span style="display: inline-block; background: #e2e8f0; color: #334155; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">1, 3, 7, 8</span>
        </td>
        <td style="padding: 14px 20px; text-align: right; font-weight: 700; color: #0f172a; font-size: 15px;">75 Kč</td>
      </tr>
    </tbody>
  </table>
  <div style="padding: 12px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
    <strong>Seznam alergenů k nahlédnutí u obsluhy:</strong> 1-Obiloviny (lepek), 3-Vejce, 7-Mléko, 8-Skořápkové plody, 9-Celer, 10-Hořčice, 12-Oxid siřičitý.
  </div>
</div>`,
        minimalSnippet: `<table class="daily-menu-table">
  <thead>
    <tr><th>Jídlo</th><th>Alergeny</th><th>Cena</th></tr>
  </thead>
  <tbody>
    <tr class="category"><th colspan="3">Polévky</th></tr>
    <tr><td>Poctivá česnečka s opečeným chlebem, sýrem a uzeným</td><td>1, 7</td><td>55 Kč</td></tr>
    <tr><td>Silný hovězí vývar s játrovými knedlíčky a nudlemi</td><td>1, 3, 9</td><td>50 Kč</td></tr>
    <tr class="category"><th colspan="3">Hlavní jídla</th></tr>
    <tr><td>150g Hovězí svíčková na smetaně s houskovým knedlíkem</td><td>1, 3, 7, 9, 10</td><td>185 Kč</td></tr>
    <tr><td>180g Pečené vepřové výpečky, červené zelí, variace knedlíků</td><td>1, 3</td><td>165 Kč</td></tr>
    <tr><td>200g Smažený sýr gouda, pažitkové brambory, domácí tatarka</td><td>1, 3, 7, 10</td><td>159 Kč</td></tr>
    <tr><td>300g Krémové hříbkové risotto s parmazánem</td><td>7, 12</td><td>155 Kč</td></tr>
    <tr class="category"><th colspan="3">Dezerty</th></tr>
    <tr><td>Teplý domácí jablečný závin se zmrzlinou</td><td>1, 3, 7, 8</td><td>75 Kč</td></tr>
  </tbody>
</table>`,
      },
      allergenAnalysis: {
        detectedAllergens: [
          { number: 1, name: 'Obiloviny obsahující lepek', foundInDishes: ['Poctivá česnečka', 'Silný hovězí vývar', 'Hovězí svíčková', 'Vepřové výpečky', 'Smažený sýr', 'Jablečný závin'] },
          { number: 3, name: 'Vejce a výrobky z nich', foundInDishes: ['Hovězí vývar (nudle/knedlíčky)', 'Hovězí svíčková (knedlík)', 'Vepřové výpečky (knedlík)', 'Smažený sýr (trojobal, tatarka)', 'Jablečný závin'] },
          { number: 7, name: 'Mléko a výrobky z něj', foundInDishes: ['Poctivá česnečka (sýr)', 'Hovězí svíčková (smetana, máslo)', 'Smažený sýr (gouda)', 'Hříbkové risotto (máslo, parmazán)', 'Jablečný závin (zmrzlina)'] },
          { number: 8, name: 'Skořápkové plody (ořechy)', foundInDishes: ['Jablečný závin (vlašské ořechy)'] },
          { number: 9, name: 'Celer a výrobky z něj', foundInDishes: ['Silný hovězí vývar (kořenová zelenina)', 'Hovězí svíčková (základ omáčky)'] },
          { number: 10, name: 'Hořčice a výrobky z ní', foundInDishes: ['Hovězí svíčková (hořčice v základu)', 'Smažený sýr (tatarská omáčka)'] },
          { number: 12, name: 'Oxid siřičitý a siřičitany', foundInDishes: ['Hříbkové risotto (podlité bílým vínem)'] },
        ],
        safetyWarnings: [
          'Pozor na hovězí svíčkovou: Obsahuje celer (9) a hořčici (10) v zeleninovém základu, což personál často zapomíná uvádět!',
          'Tatarská omáčka k smaženému sýru: Ověřte přítomnost žloutků (3) a hořčice (10).',
          'Česnečka: Opečený chléb a jíška tvoří lepek (1), strouhaný sýr tvoří mléko (7).',
        ],
        isInspectionReady: true,
      },
      marketingTips: [
        'Nejlepší čas pro sdílení na Facebooku v pracovní dny je mezi 10:15 a 10:45 – kanceláře zrovna řeší, kam vyrazit na oběd.',
        'Na Instagram Stories přidejte nálepku s anketou: "Dnes Svíčková vs. Výpečky?" – razantně tím zvýšíte dosah profilu.',
        'Svíčková patří mezi nejfotogeničtější jídla – doporučujeme vyfotit terč z brusinek shora při přirozeném denním světle.',
      ],
    },
  },
  {
    id: 'moderni-bistro',
    title: 'Městské bistro „Špajz & Vidlička“',
    badge: 'Moderní fresh bistro',
    description: 'Dýňový krém s kokosem, smash burger s hranolky, lososový poké bowl a chia pudink.',
    rawText: `LUNCH SPECIALS - TODAY
Polévka:
Hokkaido dýňový krém s kokosovým mlékem, praženými dýňovými semínky a chilli olejem (Vegan) - 69 Kč

Mains:
1. Double Bacon Cheddar Smash Burger - 160g vyzrálého hovězího z farmy, vyzrálý irský cheddar, křupavá slanina, zauzená chipotle mayo, máslová brioška, domácí hranolky (A: 1, 3, 7, 10, 11) - 225 Kč
2. Fresh Salmon Poké Bowl - sushi rýže, marinovaný norský losos, edamame, avokádo, nakládaný zázvor, sezam, teriyaki dresink (A: 4, 6, 11) - 219 Kč
3. Grilovaný sýr halloumi na teplém quinoovém salátu s granátovým jablkem, baby špenátem a mátovo-jogurtovým dipem (Bezlepkové) (A: 7) - 189 Kč

Sweet:
Mango-kokosový chia pudink s maracujou (Vegan, Bez lepku) - 79 Kč`,
    sampleResult: {
      restaurantName: 'Bistro Špajz & Vidlička',
      menuDate: 'Lunch Specials – Dnešní nabídka',
      servingHours: '11:00 – 15:00',
      dishes: [
        {
          category: 'Polévky',
          name: 'Hokkaido dýňový krém s kokosovým mlékem',
          description: 'Sametový veganský krém s praženými semínky a kapkami pikantního chilli oleje',
          price: '69 Kč',
          allergens: [],
        },
        {
          category: 'Hlavní jídla',
          name: 'Double Bacon Cheddar Smash Burger s hranolky',
          description: '160g vyzrálého hovězího, irský cheddar, slanina, zauzená chipotle mayo v máslové briošce',
          price: '225 Kč',
          allergens: [1, 3, 7, 10, 11],
        },
        {
          category: 'Hlavní jídla',
          name: 'Fresh Salmon Poké Bowl',
          description: 'Norský losos marinovaný v ponzu, edamame boby, zralé avokádo, sezam a sushi rýže',
          price: '219 Kč',
          allergens: [4, 6, 11],
        },
        {
          category: 'Hlavní jídla',
          name: 'Grilovaný sýr halloumi na teplém salátu z quinoy',
          description: 'Kyperský sýr, granátové jablko, baby špenát, máta a osvěžující jogurtový dip',
          price: '189 Kč',
          allergens: [7],
        },
        {
          category: 'Dezerty a doplňky',
          name: 'Mango-kokosový chia pudink s maracujou',
          description: 'Lehký osvěžující dezert bez lepku a laktózy s čerstvým mangovým pyré',
          price: '79 Kč',
          allergens: [],
        },
      ],
      socialPosts: {
        facebook: {
          headline: '🍔 Dnešní smash burger a fresh poké bowl už na vás čekají! 🥑⚡',
          body: `Středeční pauza na oběd si žádá pořádnou dávku energie a chuti! Dnes ve Špajzu servírujeme:

🥣 Polévka:
• Hokkaido dýňový krém zjemněný kokosovým mlékem s dýňovými semínky a kapkou chilli oleje (Vegan & Bez lepku) (69 Kč)

⚡ Hlavní chody:
1️⃣ Náš vyhlášený Double Bacon Cheddar Smash Burger – 160g vyzrálého hovězího, rozteklý irský cheddar, křupavá slanina, chipotle mayo a domácí hranolky (225 Kč)
2️⃣ Fresh Salmon Poké Bowl – marinovaný losos, edamame, avokádo a sezamový teriyaki dresink (219 Kč)
3️⃣ Grilovaný sýr halloumi na teplém quinoovém salátu s granátovým jablkem a mátovým jogurtem (189 Kč)

🥭 Na závěr:
• Mango-maracuja chia pudink s kokosovým mlékem (79 Kč)`,
          callToAction: '📍 Zastavte se na rychlý oběd nebo si vezměte jídlo s sebou do kanceláře. Obědváme od 11:00 do 15:00!',
          hashtags: ['#bistrozivot', '#smashburger', '#pokebowl', '#dnesobedvam', '#kamvpraze', '#bistropraha', '#healthyfastfood'],
          fullFormattedText: `🍔 Dnešní smash burger a fresh poké bowl už na vás čekají! 🥑⚡

Středeční pauza na oběd si žádá pořádnou dávku energie a chuti! Dnes ve Špajzu servírujeme:

🥣 Polévka:
• Hokkaido dýňový krém s kokosovým mlékem, semínky a chilli olejem (Vegan & Bez lepku) (69 Kč)

⚡ Hlavní chody:
1️⃣ Double Bacon Cheddar Smash Burger – 160g vyzrálého hovězího, irský cheddar, slanina, chipotle mayo a domácí hranolky (225 Kč)
2️⃣ Fresh Salmon Poké Bowl – marinovaný losos, edamame, avokádo a sezamový dresink (219 Kč)
3️⃣ Grilovaný halloumi sýr na teplé quinoe s granátovým jablkem a mátovým jogurtem (189 Kč)

🥭 Dezert:
• Mango-maracuja chia pudink (79 Kč)

📍 Bistro Špajz & Vidlička | Obědy 11:00 – 15:00
📞 Takeaway objednávky přijímáme online i telefonicky!

#bistrozivot #smashburger #pokebowl #dnesobedvam #kamvpraze #bistro #healthyfastfood #obed`,
        },
        instagram: {
          hook: 'Tenhle smash burger má v sobě víc štěstí než celá středa dohromady. 💥🍔',
          caption: `Hovězí z lokální farmy smashed na žhavém plátu, dvojitá porce rozteklého irského cheddaru a křupavá slanina. 

Pokud máš chuť na něco lehčího, lososový poké bowl s čerstvým avokádem a edamame tě spolehlivě dobije.

Který tým dneska jsi? Burger 🍔 nebo Poké 🥑?`,
          hashtags: ['#smashburger', '#pokebowl', '#praguebistro', '#dnesjim', '#foodporncz', '#kamnaobed', '#bistrofood', '#freshfood'],
          fullFormattedText: `Tenhle smash burger má v sobě víc štěstí než celá středa dohromady. 💥🍔

Hovězí z lokální farmy smashed na žhavém plátu, dvojitá porce rozteklého irského cheddaru a křupavá slanina. 

Pokud máš chuť na něco lehčího, lososový poké bowl s čerstvým avokádem a edamame tě spolehlivě dobije.

Který tým dneska jsi? Burger 🍔 nebo Poké 🥑?

📍 Bistro Špajz & Vidlička
⏱️ 11:00 – 15:00
.
#smashburger #pokebowl #praguebistro #dnesjim #foodporncz #kamnaobed #bistrofood #freshfood`,
        },
        smsWhatsapp: 'Dnes ve Špajzu: Double Cheddar Smash Burger s hranolky (225 Kč), Lososový Poké Bowl (219 Kč), Halloumi na quinoe (189 Kč). Stavte se od 11:00!',
      },
      htmlTable: {
        styledSnippet: `<div class="gastro-menu-container" style="max-width: 780px; margin: 20px auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); overflow: hidden; border: 1px solid #f0f0f0;">
  <div style="background: #18181b; color: #f4f4f5; padding: 22px 28px; text-align: center;">
    <h3 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 700;">Lunch Specials – Bistro Špajz</h3>
    <p style="margin: 0; font-size: 13px; color: #a1a1aa;">Servírujeme 11:00 – 15:00 | Takeaway k dispozici</p>
  </div>
  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr style="background: #fafafa; border-bottom: 2px solid #e4e4e7;">
        <th style="padding: 12px 20px; font-size: 12px; text-transform: uppercase; color: #71717a; text-align: left;">Položka</th>
        <th style="padding: 12px 14px; font-size: 12px; text-transform: uppercase; color: #71717a; text-align: center; width: 100px;">Alergeny</th>
        <th style="padding: 12px 20px; font-size: 12px; text-transform: uppercase; color: #71717a; text-align: right; width: 100px;">Cena</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background: #f4f4f5;"><td colspan="3" style="padding: 8px 20px; font-weight: 700; font-size: 13px; color: #27272a;">POLÉVKA</td></tr>
      <tr style="border-bottom: 1px solid #f4f4f5;">
        <td style="padding: 14px 20px;"><strong>Hokkaido dýňový krém s kokosovým mlékem</strong><div style="font-size: 12px; color: #71717a;">S praženými semínky a chilli olejem (Vegan)</div></td>
        <td style="padding: 14px 14px; text-align: center;"><span style="color: #10b981; font-size: 11px; font-weight: 600;">Bez alergenů</span></td>
        <td style="padding: 14px 20px; text-align: right; font-weight: 700;">69 Kč</td>
      </tr>
      <tr style="background: #f4f4f5;"><td colspan="3" style="padding: 8px 20px; font-weight: 700; font-size: 13px; color: #27272a;">HLAVNÍ CHODY</td></tr>
      <tr style="border-bottom: 1px solid #f4f4f5;">
        <td style="padding: 14px 20px;"><strong>Double Bacon Cheddar Smash Burger s hranolky</strong><div style="font-size: 12px; color: #71717a;">160g hovězí, cheddar, slanina, chipotle mayo, máslová brioška</div></td>
        <td style="padding: 14px 14px; text-align: center;"><span style="background: #e4e4e7; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">1, 3, 7, 10, 11</span></td>
        <td style="padding: 14px 20px; text-align: right; font-weight: 700;">225 Kč</td>
      </tr>
      <tr style="border-bottom: 1px solid #f4f4f5;">
        <td style="padding: 14px 20px;"><strong>Fresh Salmon Poké Bowl</strong><div style="font-size: 12px; color: #71717a;">Norský losos v ponzu, edamame, avokádo, sushi rýže, sezam</div></td>
        <td style="padding: 14px 14px; text-align: center;"><span style="background: #e4e4e7; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">4, 6, 11</span></td>
        <td style="padding: 14px 20px; text-align: right; font-weight: 700;">219 Kč</td>
      </tr>
      <tr style="border-bottom: 1px solid #f4f4f5;">
        <td style="padding: 14px 20px;"><strong>Grilovaný halloumi na teplém salátu z quinoy</strong><div style="font-size: 12px; color: #71717a;">Granátové jablko, baby špenát, mátový jogurtový dip</div></td>
        <td style="padding: 14px 14px; text-align: center;"><span style="background: #e4e4e7; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">7</span></td>
        <td style="padding: 14px 20px; text-align: right; font-weight: 700;">189 Kč</td>
      </tr>
      <tr style="background: #f4f4f5;"><td colspan="3" style="padding: 8px 20px; font-weight: 700; font-size: 13px; color: #27272a;">DEZERT</td></tr>
      <tr>
        <td style="padding: 14px 20px;"><strong>Mango-kokosový chia pudink s maracujou</strong><div style="font-size: 12px; color: #71717a;">Veganské, bez lepku a laktózy</div></td>
        <td style="padding: 14px 14px; text-align: center;"><span style="color: #10b981; font-size: 11px; font-weight: 600;">Bez alergenů</span></td>
        <td style="padding: 14px 20px; text-align: right; font-weight: 700;">79 Kč</td>
      </tr>
    </tbody>
  </table>
</div>`,
        minimalSnippet: `<table class="bistro-menu">
  <thead><tr><th>Položka</th><th>Alergeny</th><th>Cena</th></tr></thead>
  <tbody>
    <tr><td>Hokkaido dýňový krém</td><td>-</td><td>69 Kč</td></tr>
    <tr><td>Double Bacon Cheddar Smash Burger</td><td>1, 3, 7, 10, 11</td><td>225 Kč</td></tr>
    <tr><td>Fresh Salmon Poké Bowl</td><td>4, 6, 11</td><td>219 Kč</td></tr>
    <tr><td>Grilovaný halloumi na quinoe</td><td>7</td><td>189 Kč</td></tr>
    <tr><td>Mango chia pudink</td><td>-</td><td>79 Kč</td></tr>
  </tbody>
</table>`,
      },
      allergenAnalysis: {
        detectedAllergens: [
          { number: 1, name: 'Obiloviny obsahující lepek', foundInDishes: ['Smash Burger (brioška)'] },
          { number: 3, name: 'Vejce a výrobky z nich', foundInDishes: ['Smash Burger (chipotle mayo, brioška)'] },
          { number: 4, name: 'Ryby a výrobky z nich', foundInDishes: ['Fresh Salmon Poké Bowl (losos)'] },
          { number: 6, name: 'Sójové boby (sója)', foundInDishes: ['Fresh Salmon Poké Bowl (edamame, ponzu)'] },
          { number: 7, name: 'Mléko a výrobky z něj', foundInDishes: ['Smash Burger (cheddar, máslo)', 'Grilovaný halloumi (sýr, jogurt)'] },
          { number: 10, name: 'Hořčice a výrobky z ní', foundInDishes: ['Smash Burger (chipotle mayo)'] },
          { number: 11, name: 'Sezamová semena', foundInDishes: ['Smash Burger (sezam na briošce)', 'Poké Bowl (sezamový posyp & olej)'] },
        ],
        safetyWarnings: [
          'Pozor na briošku u burgeru: Často obsahuje sezam (11) a vaječnou glazuru (3).',
          'Sójová omáčka / ponzu u poké: Zkontrolujte, zda omáčka neobsahuje pšeničný lepek (1) – tradiční sójovky bývají pšeničné!',
          'Edamame: Jedná se o nezralé sójové boby (6), pro alergiky na sóju vysoce rizikové.',
        ],
        isInspectionReady: true,
      },
      marketingTips: [
        'Smash burgery a poké bowls mají nejvyšší proklikovost na Instagram Reels a Stories.',
        'Použijte detailní záběr na řez burgeru s vytékajícím sýrem jako cover fotku.',
        'Zdůrazněte bezlepkovou a veganskou variantu polévky – až 30 % kancelářských hostů to aktivně vyhledává.',
      ],
    },
  },
];
