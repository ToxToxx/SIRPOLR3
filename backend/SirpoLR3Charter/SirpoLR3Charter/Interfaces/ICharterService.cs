using SirpoLR3Charter.Models;
using System.ServiceModel;

namespace SirpoLR3Charter.Interfaces
{
    [ServiceContract]
    public interface ICharterService
    {
        [OperationContract]
        Task  AddCharter(string citiesPath, int Price, DateTime date);
        
        [OperationContract]
        Task<IEnumerable<Charter>> GetAllCharts();
    }
}
