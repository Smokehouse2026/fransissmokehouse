<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>The Francis Smokehouse — Site Data</title>
<style>
  body{font-family:Georgia,serif;max-width:700px;margin:40px auto;padding:20px;background:#fdf8f0;color:#1a0e04;}
  h1{font-size:28px;margin-bottom:6px;color:#c04800;}
  .subtitle{color:#8a6840;font-style:italic;margin-bottom:32px;font-size:15px;}
  h2{font-size:18px;letter-spacing:.08em;text-transform:uppercase;color:#c04800;
     border-bottom:2px solid #c04800;padding-bottom:6px;margin:28px 0 16px;}
  .instructions{background:#fff8ee;border:1px solid #e8c87a;padding:14px 18px;
     border-radius:4px;font-size:13px;color:#5a3e18;line-height:1.6;margin-bottom:20px;}
  .instructions strong{color:#c04800;}
  .special-item{background:#fff;border:1px solid #e0c89a;border-radius:6px;
     padding:16px 18px;margin-bottom:12px;}
  .field-row{display:flex;gap:12px;margin-bottom:8px;align-items:flex-start;flex-wrap:wrap;}
  .field-label{font-size:11px;letter-spacing:.15em;text-transform:uppercase;
     color:#8a6840;min-width:70px;padding-top:3px;}
  .field-val{font-size:14px;color:#1a0e04;flex:1;}
</style>
</head>
<body>

<h1>The Francis Smokehouse</h1>
<div class="subtitle">Site Data — Edit this file to update your daily specials</div>

<div class="instructions">
  <strong>How to update specials:</strong> Edit the text inside each
  <code>&lt;span&gt;</code> tag below. You can change the name, description, price and type.
  To hide a special, add <code>data-hidden="true"</code> to its
  <code>&lt;div class="special"&gt;</code> tag.
  To add a new special, copy any block and paste it before the closing
  <code>&lt;!-- END SPECIALS --&gt;</code> comment.
  <br><br>
  <strong>Price tip:</strong> Leave price empty or write "Market Price" if it varies.
  <strong>Type options:</strong> Appetizer, Entrée, Seafood, Dessert, Soup, Side Special
</div>

<h2>Daily Specials Board</h2>

<!-- ═══════════════════════════════════════
     SPECIALS — Edit the text inside spans
     Last updated: check with your team daily
═══════════════════════════════════════ -->
<div id="specials-data">

  <div class="special" data-hidden="false">
    <div class="field-row"><div class="field-label">Type</div><div class="field-val"><span class="sp-type">Appetizer</span></div></div>
    <div class="field-row"><div class="field-label">Name</div><div class="field-val"><span class="sp-name">Sweet Thai Chili Wings</span></div></div>
    <div class="field-row"><div class="field-label">Desc</div><div class="field-val"><span class="sp-desc">Smoked wings tossed in house-made sweet Thai chili glaze. Sticky, smoky, addictive.</span></div></div>
    <div class="field-row"><div class="field-label">Price</div><div class="field-val"><span class="sp-price">$16</span></div></div>
  </div>

  <div class="special" data-hidden="false">
    <div class="field-row"><div class="field-label">Type</div><div class="field-val"><span class="sp-type">Entrée</span></div></div>
    <div class="field-row"><div class="field-label">Name</div><div class="field-val"><span class="sp-name">Eggplant Pirogue</span></div></div>
    <div class="field-row"><div class="field-label">Desc</div><div class="field-val"><span class="sp-desc">Hollowed eggplant filled with rich Cajun seafood stuffing. A Louisiana classic.</span></div></div>
    <div class="field-row"><div class="field-label">Price</div><div class="field-val"><span class="sp-price">$26</span></div></div>
  </div>

  <div class="special" data-hidden="false">
    <div class="field-row"><div class="field-label">Type</div><div class="field-val"><span class="sp-type">Entrée</span></div></div>
    <div class="field-row"><div class="field-label">Name</div><div class="field-val"><span class="sp-name">Blackened Lemon Fish</span></div></div>
    <div class="field-row"><div class="field-label">Desc</div><div class="field-val"><span class="sp-desc">Blackened fresh fish with cream spinach and grilled Louisiana crawfish tails.</span></div></div>
    <div class="field-row"><div class="field-label">Price</div><div class="field-val"><span class="sp-price">$28</span></div></div>
  </div>

  <div class="special" data-hidden="false">
    <div class="field-row"><div class="field-label">Type</div><div class="field-val"><span class="sp-type">Entrée</span></div></div>
    <div class="field-row"><div class="field-label">Name</div><div class="field-val"><span class="sp-name">Jack Daniel's BBQ Shrimp</span></div></div>
    <div class="field-row"><div class="field-label">Desc</div><div class="field-val"><span class="sp-desc">Gulf shrimp in JD BBQ glaze with 14oz bone-in pork chop, mac & cheese and green beans.</span></div></div>
    <div class="field-row"><div class="field-label">Price</div><div class="field-val"><span class="sp-price">$26</span></div></div>
  </div>

  <div class="special" data-hidden="false">
    <div class="field-row"><div class="field-label">Type</div><div class="field-val"><span class="sp-type">Entrée</span></div></div>
    <div class="field-row"><div class="field-label">Name</div><div class="field-val"><span class="sp-name">Grilled Salmon</span></div></div>
    <div class="field-row"><div class="field-label">Desc</div><div class="field-val"><span class="sp-desc">Grilled salmon with Louisiana crabmeat, avocado cream sauce and house sides.</span></div></div>
    <div class="field-row"><div class="field-label">Price</div><div class="field-val"><span class="sp-price">$28</span></div></div>
  </div>

  <div class="special" data-hidden="false">
    <div class="field-row"><div class="field-label">Type</div><div class="field-val"><span class="sp-type">Dessert Special</span></div></div>
    <div class="field-row"><div class="field-label">Name</div><div class="field-val"><span class="sp-name">Miss Mud Pie</span></div></div>
    <div class="field-row"><div class="field-label">Desc</div><div class="field-val"><span class="sp-desc">The house dessert special. Rich, indulgent, worth every bite.</span></div></div>
    <div class="field-row"><div class="field-label">Price</div><div class="field-val"><span class="sp-price">$7</span></div></div>
  </div>

</div>
<!-- END SPECIALS -->

</body>
</html>
