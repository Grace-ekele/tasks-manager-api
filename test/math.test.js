const {calculateTip,fahrenheitToCelsius,celsiusToFahrenheit,add} = require('../math')

test('should calculate the total with tip', ()=>{
    const total = calculateTip(10, .3)
    expect(total).toBe(13)

    
})

test('should calculate total with default tip', ()=>{
    const total = calculateTip(10)
    expect(total).toBe(12.5)
})


test('should convert 32 f to 0 c', () =>{
    const temp = fahrenheitToCelsius(32)
    expect(temp).toBe(0)
})
test('should convert 0 c  to 32 f ', () =>{
    const temp = celsiusToFahrenheit(0)
    expect(temp).toBe(32)
})

// test('Async tet demo', (done) =>{

//     setTimeout(() => {
//         expect(1).toBe(2)
//         done()
//     }, 5000);
   
// })

test('should add two numbers',(done) =>{
    add(2,3).then((sum) =>{
        expect(sum).toBe(5)
        done()
    })
})

test('should add two numbers async/await', async () => {
    const sum = await add(10,22)
    expect(sum).toBe(32)
})