export function getAverage(nums) {
  if(!Array.isArray(nums) || !nums.length) {
    console.error('First argument has to be a non-empty array, provided:', nums);
    return 0;
  }
  
  let sum = 0;
  let validElementsCount = nums.length;

  for(let i = 0; i < nums.length; i++) {
    const num = nums[i];
    
    if(typeof num !== 'number') {
      console.error(`Element at index ${i} of provided array is not a number:`, num);
      validElementsCount--;
      continue;
    }
    sum += num;
  }
  
  return (sum / validElementsCount) || 0;
}