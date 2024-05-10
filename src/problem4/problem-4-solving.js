function sum_to_n_a(n) {
    return n * (n+1) / 2 
}

function sum_to_n_b(n) {
	return new Array(n  + 1).fill(n).reduce((a,b ) => a + b  , 0) / 2
}

function sum_to_n_c(n) {
	if(n === 1) return 1 ;
    else return n + sum_to_n_c(n- 1);
}

function sum_to_n_d(n) {
	let sum = 0;
    new Array(n).fill(0).forEach((item , index) => sum += index + 1)
    return sum ;
}