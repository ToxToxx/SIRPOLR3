using System.Runtime.Serialization;

namespace SirpoLR3Charter.Models
{
    [DataContract]
    public class Charter
    {
        [DataMember]
        public Guid Id { get; init; }
        [DataMember]
        public required string CititesPath { get; init; }
        [DataMember]
        public int Price { get; init; }
        [DataMember]
        public DateTime DateTime { get; init; }
        [DataMember]
        public DateTime CreatedAt { get; init; }

        public Charter (string citiesPath, int price, DateTime dateTime)
        {
            CititesPath = citiesPath;
            Price = price;
            DateTime = dateTime;
            CreatedAt = DateTime.Now;
        }
    }
}
