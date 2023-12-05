export type GroceryItemType = {
  id: number,
  name: string,
  expiryDate: string,
  addDate: string,
  units: number, // Number of units
  // quantity: Number,
  // quantityMeasure: String,
  // price: Number,
  // priceType: String,
}

const dummyData: GroceryItemType[] = [
  {
    id: 6,
    name: 'FYFFES RAINFOREST ALLIANCE BANANAS',
    expiryDate: '25/11/2023',
    addDate: '25/11/2023',
    units: 1,
    // price: 10.89,
    // priceType: '£',
  },
  {
    id: 1,
    name: 'M&S OAKHAM GOLD CHICKEN BREAST FILLETS',
    expiryDate: '26/11/2023',
    addDate: '26/11/2023',
    units: 1,
    // price: 14.25,
    // priceType: '£',
  },
  {
    id: 2,
    name: 'JACKSONS JOY FARMHOUSE WHOLEMEAL',
    expiryDate: '26/11/2023',
    addDate: '26/11/2023',
    units: 1,
    // price: 14.25,
    // priceType: '£',
  },
  {
    id: 3,
    name: 'FINNEBROGUE NAKED 12 GOOD LITTLE COMPANY CHIPOLATAS',
    expiryDate: '28/11/2023',
    addDate: '28/11/2023',
    units: 1,
    // price: 13.75,
    // priceType: '£',
  },
  {
    id: 4,
    name: 'ARLA LACTOFREE SEMI SKIMMED MILK DRINK',
    expiryDate: '30/11/2023',
    addDate: '30/11/2023',
    units: 1,
    // price: 23.90,
    // priceType: '£',
  },
  {
    id: 5,
    name: 'ARLA LACTOFREE SEMI SKIMMED MILK DRINK',
    expiryDate: '30/11/2023',
    addDate: '30/11/2023',
    units: 1,
    // price: 23.90,
    // priceType: '£',
  },
]
export default dummyData

// export const dummyData = 
// { '26/11/2023': ['M&S OAKHAM GOLD CHICKEN BREAST FILLETS 300g1/14.25', 'JACKSONS JOY FARMHOUSE WHOLEMEAL 700g 1/11.30'], '28/11/2023': ['FINNEBROGUE NAKED 12 GOOD LITTLE COMPANY CHIPOLATAS 340g1/13.75'], 

// '30/11/2023': ['ARLA LACTOFREE SEMI SKIMMED MILK DRINK 1l (£1.95/EACH)2/23.90', 'FINNEBROGUE NAKED 5 SLICES DELI HAM 100g (£2.00/EACH)2/24.00', 'M&S BRITISH EXTRA MATURE GRATED CHEDDAR 250g1/12.80', 'M&S SLICED EDAM CHEESE 10 SLICES 250g 1/12.80', 'BARILLA WHOLE WHEAT PASTA SPAGHETTI WHOLEGRAIN PASTA 500g1/11.55', 'BENS ORIGINAL THAI SWEET CHILLI MICROWAVE RICE 220g (£1.15/EACH)2/22.30', 'CLARENCE COURT BURFORD BROWN MIXED FREE RANGE EGGS 101/14.65', 'DIET COKE CAFFEINE FREE 8x330ml (£3.75/EACH) 2/27.50*', "DINO'S FAMOUS SWEET STACKER PICKLES 530g 1/12.50", 'FIBRE ONE 90 CALORIE CHOCOLATE FUDGE BROWNIE BARS 5x24g1/12.00', 'FIBRE ONE 90 CALORIE SALTED CARAMEL BARS 5x24g1/12.00', 'M&S BAKED BEANS 400g 1/10.50', 'M&S DECAF GROUND COFFEE 227g 1/13.10', 'OCADO CHICKPEAS IN WATER 400g 1/10.55', 'OCADO ITALIAN BLEND ROASTED COFFEE BEANS 227g1/13.00', 'SIMPLY ROASTED MATURE CHEDDAR & RED ONION CRISPS 93g1/11.50*'], 

// '25/11/2023': ['FYFFES RAINFOREST ALLIANCE BANANAS 5 1/10.89'], 
// '27/11/2023': ['M&S SMALL WHITE PITTAS 12 1/11.60'], 
// '23/12/2023': ['CARRIER BAG (£0.10/EACH) 7/70.70*', 'DUCK ACTIVE CLEAN TOILET RIM BLOCK PINE 37g 1/12.00*'] }