var UserSchema = { name : {type: String, unique: true}, 
					undergrad : {school : String, major : String, minor : String, GPA : Number, extra : [String]},
					GRE : {verbal : Number, quantitative : Number, writing : Number}, 
					notes : String,
					schools : [{school : String, program : String, accepted : Boolean}]
				};

var UserModel = { name : null, 
					undergrad : null,
					GRE : null,
					notes : null,
					schools : null,
					get : function( field ){
						if(this[field] === undefined ) {console.error("Field error" + field); return;}
						return this[field];},
					set : function( field, value ){
						if(this[field] === undefined  || ) {console.error("Field error" + field); return;}
						this[field] = value;
					},
					append : function( field, value ){
						if(this[field] === undefined ) {console.error("Field error" + field); return;}
						this[field].push(value);
					},
					getAll: function() {
						var all_keys = Object.keys( this );
						var model = this;
						return all_keys.reduce( function (obj, current) {
							if(typeof model[current] === "function") { return obj;}
							obj[current] = model[current];
							return obj;

						}, {});
					},
					setAll: function ( obj ) {
						var new_keys = Object.keys( obj );
						var model = this;
						new_keys.every ( function ( current ) {
							if( model[current] === undefined ) {
								console.error("Undefined key");
								return true;
							}
							model[current] = obj[current];
							return true;
						})
					} 
				};



// if( sessionStorage.getItem("name" === undefined)) sessionStorage.setItem("name", "foobar");
// UserModel.set( name: sessionStorage.getItem( "name" ));
// UserModel.set( history , ["diabetes"]);
// UserModel.setAll({max_monthly: 200, current_providor: []})

