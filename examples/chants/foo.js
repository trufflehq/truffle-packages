const me = [
	{
		id: "http://localhost:50410/",
		defaultLayoutConfigSteps: [
			{ action: "querySelector", value: "#chatframe" },
			{ action: "getIframeDocument" },
			{ action: "querySelector", value: "#action-buttons" },
			{ action: "appendSubject" },
		],
		domAction: "append",
		iframeUrl: "http://localhost:50410/",
		orgId: "8e35b570-6c2f-11ec-bade-b32a8d305590",
		slug: "http://localhost:50410/",
	},
];
[{"id":"http://localhost:50410","defaultLayoutConfigSteps":[{"action":"querySelector","value":"body"},{"action":"appendSubject","value":null}],"domAction":"append","iframeUrl":"http://localhost:50410","orgId":"6f4edfe0-8446-11ec-b10d-3a946723cad5","slug":"http://localhost:50410"}]

const austin = [
	{
		"id": "http://localhost:8000/",
		"defaultLayoutConfigSteps": [
			{
				"action": "querySelector",
				"value": "#chatframe"
			},
			{
				"action": "getIframeDocument"
			},
			{
				"action": "querySelector",
				"value": "#action-buttons"
			},
			{
				"action": "appendSubject"
			}
		],
		"domAction": "append",
		"iframeUrl": "http://localhost:8000/",
		"orgId": "8e35b570-6c2f-11ec-bade-b32a8d305590",
		"slug": "http://localhost:8000/"
	}
]