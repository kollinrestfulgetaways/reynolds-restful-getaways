export const siteUrl = 'https://reynolds-restful-getaways.kollin-reyno-7892.chatgpt.site';
export const email = 'kollin@reynoldsrestfulgetaways.com';
export const ownerId = '4ff3c22e-1696-4c3c-9285-7c3e4f983020';
export const cards = [
 {id:'sapphire',name:'Chase Sapphire Preferred®',short:'Sapphire Preferred',issuer:'CHASE',category:'Flights',color:'blue',fee:'$95',best:'Flexible travel rewards',description:'A flexible starting point for a travel strategy built around airline and hotel transfer partners.',note:'A personal favorite from my own points journey. Compare the current referral offer with the public offer before applying.',referral:true,url:'https://www.referyourchasecard.com/19y/OKOVTJJIVR',source:'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'},
 {id:'hilton',name:'Hilton Honors Surpass®',short:'Hilton Honors Surpass',issuer:'AMERICAN EXPRESS',category:'Hotels',color:'gold',fee:'Check current offer',best:'Travelers who prefer Hilton',description:'A hotel-focused option to compare if Hilton is where you already like to stay.',note:'Consider your actual Hilton plans and the current fee. Hotel-specific points are less flexible than a transferable currency.',referral:false,url:'https://www.hilton.com/en/hilton-honors/credit-cards/',source:'https://www.hilton.com/en/hilton-honors/credit-cards/'},
 {id:'double-cash',name:'Citi Double Cash®',short:'Double Cash',issuer:'CITI',category:'Cashback',color:'teal',fee:'$0',best:'Simple everyday cash back',description:'An everyday cash-back option for travelers who value a straightforward approach.',note:'Cash back may fit better than travel points when your plans are uncertain. Review the earning rules and terms directly with Citi.',referral:false,url:'https://www.citi.com/credit-cards/citi-double-cash-credit-card',source:'https://www.citi.com/credit-cards/citi-double-cash-credit-card'},
 {id:'freedom',name:'Chase Freedom Unlimited®',short:'Freedom Unlimited',issuer:'CHASE',category:'Beginners',color:'silver',fee:'$0',best:'Learning rewards at your pace',description:'A no-annual-fee option to consider while building a simple rewards routine.',note:'Beginner-friendly does not mean guaranteed approval. Start with your budget, payment habits, and the current issuer terms.',referral:false,url:'https://www.chase.com/personal/credit-cards/freedom/unlimited',source:'https://www.chase.com/personal/credit-cards/freedom/unlimited'}
];
export const gear = [
 {id:'packing-cubes',name:'Compression packing cubes',category:'Packing',tag:'A little more organized',description:'Separate outfits, keep small items together, and make unpacking easier.',icon:'cubes',query:'compression packing cubes travel'},
 {id:'adapter',name:'Universal travel adapter',category:'Accessories',tag:'Check your destination',description:'Look for the right plug types, USB ports, and compatibility for your devices.',icon:'plug',query:'universal travel adapter usb c'},
 {id:'cardholder',name:'Slim travel cardholder',category:'Accessories',tag:'Less bulk, more room',description:'Keep the cards you need handy and leave the rest safely at home.',icon:'wallet',query:'slim travel cardholder'},
 {id:'carry-on',name:'Carry-on luggage',category:'Luggage',tag:'Measure before you fly',description:'Compare weight, dimensions, and airline size limits before choosing a bag.',icon:'luggage',query:'lightweight carry on luggage'},
 {id:'organizer',name:'Tech & cable organizer',category:'Packing',tag:'Everything in one place',description:'A home for chargers, spare cables, and the adapter you always need.',icon:'cable',query:'travel tech cable organizer pouch'},
 {id:'daypack',name:'Packable daypack',category:'Luggage',tag:'For the exploring days',description:'A lightweight option for water, a layer, and a few daily essentials.',icon:'backpack',query:'lightweight packable daypack'}
];
export const guides = [
 {slug:'points-and-miles-start-here',title:'Your first points trip starts here.',category:'Start here',image:'/tokyo-torii.jpg',time:'6 min read',description:'A simple, practical path from “where do I start?” to a trip you can actually plan.',sections:[
 ['Start with a trip, not a card','Pick one destination, a rough travel window, and how many people are going. Write down which airports you can realistically use. This gives every points decision a purpose.'],
 ['Take stock of what you have','List your existing airline miles, hotel points, bank rewards, and cards. Keep account numbers and passwords private. You may already have part of the trip covered.'],
 ['Learn the two booking paths','You may be able to book travel through your rewards program, or transfer eligible bank points to a participating airline or hotel program. Compare the full cost and terms of each path for the specific trip.'],
 ['Build a sustainable routine','Choose rewards that match spending you already do. Do not spend extra just to earn points. Compare annual fees and consider whether the benefits fit your real plans.'],
 ['Make one small next move','Try a search for one flight or one hotel night. Note the points price, taxes, fees, and cancellation terms. Save the option before making any commitment.']
 ]},
 {slug:'book-flights-with-points',title:'Find the flight. Then use the points.',category:'Flights',image:'/tokyo-evening.jpg',time:'7 min read',description:'How to build an award-flight shortlist without getting lost in a dozen browser tabs.',sections:[
 ['Write a flexible search brief','Start with your origin, destination, number of travelers, dates, and preferred cabin. If possible, include nearby airports and a few alternate dates.'],
 ['Search before you transfer','Check the airline program you would actually book through. Search for every traveler together and confirm the itinerary, cabin on each segment, and whether the seat is currently bookable.'],
 ['Compare the whole price','Record points, cash taxes and fees, connection time, baggage rules, and cancellation conditions. Compare against a cash flight you would realistically buy.'],
 ['Check the transfer details','Read the current transfer ratio, minimum, expected time, account-name requirements, and transfer terms in your bank program. Do not assume the ratio is the same for every partner or card. Transfers may not be reversible, and award space can disappear.'],
 ['Book and save the confirmation','After booking, save the confirmation and verify the reservation with the operating airline. Check names and dates carefully. Make sure you understand how changes and cancellations work for that booking.']
 ]},
 {slug:'book-hotels-with-points',title:'A better stay, with a smarter points plan.',category:'Hotels',image:'/tokyo-shrine-gate.jpg',time:'5 min read',description:'Compare location, points, and cash to choose a stay that works for the whole trip.',sections:[
 ['Choose a neighborhood first','Think about how you want to spend your days. A lower points price may be less useful if you spend extra time and money commuting across the city.'],
 ['Search the exact stay','Enter your actual dates, guest count, and room needs in the hotel program. Check whether the award room can accommodate everyone.'],
 ['Compare like with like','Compare the same room type and a cash rate with similar cancellation terms. Include taxes and property fees shown during booking rather than assuming every award stay avoids them.'],
 ['Check before moving points','Confirm current availability, the transfer ratio and timing, and the total points required. Read the terms before moving flexible bank points into a hotel program.'],
 ['Save the details','Keep the reservation, cancellation deadline, and any payment requirements. Revisit the booking if your travel plans change. A good hotel redemption is one that fits the trip.']
 ]},
 {slug:'tokyo-japan-points-trip',title:'From points to Tokyo: our summer trip.',category:'Trip stories',image:'/tokyo-hachiko.jpg',time:'8 min read',description:'Chase points, Hyatt, and American Airlines miles — and the real trip they helped make possible.',sections:[
 ['The trip behind the points','After points helped us make a dream trip to Paris happen, Japan felt like the next chapter. We used a mix of Chase points, Hyatt, and American Airlines miles for our summer trip to Tokyo.'],
 ['A base in Shibuya','We transferred Chase points to Hyatt to book Hyatt House Tokyo Shibuya. Being based in Shibuya gave us a starting point for exploring the city, including a stop at the Hachiko statue. This describes our past booking; check current program terms for a new trip.'],
 ['Mixing cabins made the trip work','We used American Airlines miles for Japan Airlines premium economy on the way to Japan and American Airlines business class on the way home. We worked with the award space we could actually book.'],
 ['About 200,000 points and miles','Across the portions we booked with rewards, we used roughly 200,000 points and miles total. That did not make the trip free: food, transportation, activities, taxes, and fees were still part of our budget.'],
 ['Travel first. Rewards second.','The best value was getting to go. For our next trip, I would keep the same approach: start with the destination, compare the available options, and let the points strategy serve the trip.']
 ]}
];
export const packages = [
 {id:'foundations',name:'Points Foundations',price:49,duration:'30 minutes',description:'A clear starting point for your points journey.',features:['Review your goals and existing rewards','Understand your next practical step','A simple personal action checklist']},
 {id:'strategy',name:'Your Travel Strategy',price:99,duration:'60 minutes',description:'Turn a destination idea into a focused plan.',features:['Review your cards and rewards balances','Explore flight and hotel booking paths','A tailored earning and redemption outline','Written session recap'],featured:true},
 {id:'trip',name:'Trip Planning Session',price:179,duration:'90 minutes',description:'Work through the moving parts of one trip.',features:['Everything in Your Travel Strategy','Live flight and hotel search guidance','Compare points and cash options','A trip shortlist and next-step plan']}
];
export function outbound(id:string){const card=cards.find(c=>c.id===id);if(card)return card.url;const item=gear.find(g=>g.id===id);return item?'https://www.amazon.com/s?k='+encodeURIComponent(item.query):null;}
