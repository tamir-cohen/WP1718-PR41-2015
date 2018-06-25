using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    [JsonObject("json")]
    public class Json
    {
        [JsonProperty("place_id")]
        public string place_id { get; set; }
        [JsonProperty("licence")]
        public string licence { get; set; }
        [JsonProperty("osm_type")]
        public string osm_type { get; set; }
        [JsonProperty("osm_id")]
        public string osm_id { get; set; }
        [JsonProperty("lat")]
        public string lat { get; set; }
        [JsonProperty("lon")]
        public string lon { get; set; }
        [JsonProperty("display_name")]
        public string display_name { get; set; }
        public Address address { get; set; }
        public string[] boundingbox { get; set; }

        public Json()
        {
            address = new Address();
        }
    }
}