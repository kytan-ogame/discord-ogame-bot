module.exports = class Utils  {
	// tranform a number from 10000 to '10.000'
	static parseNumber(n){
		return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
}