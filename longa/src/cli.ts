import * as Program from "commander"


/// Given a condition and an error message
/// Print's the error message to stderr if the condition is false
/// Returns whether the condition was truthy
export function insist (condition, error) {
	if (!condition) {
		console.error(error);
		return false;
	}

	return true;
}

export function insistOr (condition, error, cb) {
	if (!insist (condition, error)) {
		cb ()
	}

	return true
}



//Whats up gamers///DSASDDSADSADSDSAADSDSADSsdsadasdsadsadsadsa