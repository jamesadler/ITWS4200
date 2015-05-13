
var angApp = angular.module('DbPedia', []);

angApp.controller("DbPediaCtrl", function($scope, $http){
	// Sets the example Sparql query
	$scope.query = "SELECT ?name, ?foundingDate, ?externalLink\n";
	$scope.query += "WHERE {\n";
	$scope.query += "\t?company a dbpedia-owl:Organisation .\n";
	$scope.query += "\t?company dbpedia-owl:foundationPlace <http://dbpedia.org/resource/California> .\n";
	$scope.query += "\t?company dbpprop:name ?name .\n";
	$scope.query += "\t?company dbpedia-owl:foundingDate ?foundingDate .\n";
	$scope.query += "\t?company dbpedia-owl:wikiPageExternalLink ?externalLink\n";
	$scope.query += "}";
	$scope.query += "\nORDER BY ASC (?company)\nLIMIT 10";

	$scope.requestQuery = function() {
		$.post("/requestQuery", {q: $scope.query},
		 function(data){
			data = JSON.parse(data);
			$rowTmp = $("<tr />");

			$("#output").attr("border","1");
			$("#output").html($rowTmp.clone());

			// sets up the table header
			for(item in data[0]){
				$("#output tr:first").append("<th>"+item+"</th>");
			}

			// fills in the table with the results
			for(var i=0; i < data.length; i++){
				$row = $rowTmp.clone();
        		for(item in data[i]){
        			var tmp = data[i][item];
        			// if the item is a url, make it a valid link
        			if(tmp.type === "uri"){
        				$row.append("<td><a href='"+tmp.value+"'>"+tmp.value+"</a></td>");
        			} else {
        				$row.append("<td>"+tmp.value+"</td>");
        			}
           		}
        		$("#output").append($row);
  			}
		});

	}

});