using SirpoLR3Charter.Models;
using System.ServiceModel;

namespace SirpoLR3Charter.Interfaces
{
    [ServiceContract]
    public interface ICharterService
    {
        [OperationContract]
        Task  AddCharter(string citiesPath, int Price, string date);
        
        [OperationContract]
        Task<IEnumerable<Charter>> GetAllCharts();

        [OperationContract]
        Task DeleteCharter(Guid id);
    }
}
