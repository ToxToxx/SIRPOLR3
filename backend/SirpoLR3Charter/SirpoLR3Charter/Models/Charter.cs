using System;
using System.Runtime.Serialization;

namespace SirpoLR3Charter.Models
{
    [DataContract]
    public class Charter
    {
        [DataMember]
        public Guid Id { get; init; }
        [DataMember]
        public string CititesPath { get; init; }
        [DataMember]
        public int Price { get; init; }
        [DataMember]
        public DateTime CharterDateTime { get; init; } 
        [DataMember]
        public DateTime CreatedAt { get; init; }
    }
}
