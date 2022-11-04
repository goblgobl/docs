const env = require('./env');

const http = [
	{code: 2001, desc: "<p>A generic internal server error. This is the least specific and thus least useful error. The response will have an uuid <code>Error-Id</code> header and the same value will be in the <code>error_id</code> field of the response. Assuming ERROR level (or lower) logging is enabled, a log containing the eid=$ID attribute will contain more data. Because this is an unexpected error, including more details in the HTTP response could result in sensitive data being leaked, thus only a referenced to the logged error is provided.</p>"},
	{code: 2002, desc: "<p>A response could not be serialized to JSON. Like the <a href=#error_2001>2001 error</a>, please see the <code>error_id</code> and corresponding log entry. This error is almost certainly a result of a bug. We we hope that you'll report it.</p>"},
	{code: 2003, desc: "<p>The request payload was not valid JSON.</p>"},
	{code: 2004, desc: "<p>The request contained invalid data. See the <a href=#errors_validation>validation section</a> for details on validation errors.</p>"},
];

const validation = [
	{code: 1001, desc: "<p>The value is required.</p>"},
	{code: 1002, desc: "<p>The value must be a string.</p>"},
	{code: 1003, desc: "<p>The string must be within a certain <code>min</code> and <code>max</code> length.</p>"},
	{code: 1004, desc: "<p>The string does not satisfy the required pattern.</p>"},
	{code: 1005, desc: "<p>The value must be an integer.</p>"},
	{code: 1006, desc: "<p>The integer must be greater or equal than <code>min</code>.</p>"},
	{code: 1007, desc: "<p>The integer must be less than or equal than <code>max</code>.</p>"},
	{code: 1008, desc: "<p>The integer must be greater or equal than <code>min</code> and less than or equal than <code>max</code>.</p>"},
	{code: 1009, desc: "<p>The value must be a boolean.</p>"},
];

const authen = {
	http: [
		{code: 102001, desc: "<p>Not found. Specifically relates to the path in the URL.</p>"},
		{code: 102002, desc: "<p><code>Gobl-Project</code> header is missing. Only applicable when multi-tenancy is enabled.</p>"},
		{code: 102003, desc: "<p>The id specified by the <code>Gobl-Project</code> header was not valid. Only applicable when multi-tenancy is enabled.</p>"},
		{code: 102005, desc: `<p>The project has reached the <a href=${env.baseURL}/authen/#config_totp_max>maximum configured TOTP</a> entries.</p>`},
		{code: 102006, desc: "<p>The TOTP entry could not be found. This means the <code>user_id</code> or optionally <code>user_id + type</code> did not correspond to an existing TOTP (or <code>project_id + user_id + type</code> when multi-tenancy is enabled). Note that TOTP that are setup but not confirmed before the <a href=#config_totp_setup_ttl>configured TTL</a> are periodically deleted.</p>"},
		{code: 102007, desc: "<p>The <code>key</code> parameter to decrypt/encrypt the TOTP secret was incorrect.</p>"},
		{code: 102008, desc: "<p>The <code>code</code> parameter to confirm or verify a TOTP was incorrect.</p>"},
		{code: 102009, desc: `<p>The project has reached the <a href=${env.baseURL}/authen/#config_ticket_max>maximum configured tickets</a>.</p>`},
		{code: 102010, desc: `<p>The <code>payload</code> is larger than the <a href=${env.baseURL}/authen/#config_ticket_max_payload_length>maximum configured length</a>.</p>`},
		{code: 102011, desc: "<p>The <code>ticket</code> could not be found.</p>"}
	],
	validation: [
		{code: 101001, desc: "<p>The <code>key</code> parameter was not a valid HEX-encoded value.</p>"},
		{code: 101002, desc: "<p>The <code>ticket</code> parameter was not a valid Base64-encoded value.</p>"}
	]
};

const all = {http, authen, validation};
const lookup = buildLookup(all, {});
all.lookup = function(id) { return lookup[id]; };
module.exports = all;


function buildLookup(container, lookup) {
	if (Array.isArray(container)) {
		for (entry of container) {
			lookup[entry.code] = entry;
		}
		return;
	}

	for (const k in container) {
		buildLookup(container[k], lookup);
	}
	return lookup;
}
